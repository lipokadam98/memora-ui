import { computed, inject, effect, untracked } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { MultimediaControllerService, MultimediaResponseDto } from '../api';
import { AuthStore } from '../authentication/auth-store';
import { Logger } from '../util/logger';
import { TranslateHelperService } from '../util/translate-helper-service';
import { getErrorMessage } from '../util/util';

type MultimediaState = {
  multimedia: MultimediaResponseDto[];
  isLoading: boolean;
  selectedMultimedia: MultimediaResponseDto | null;
  storedSelections: number[];
  hidePreviousButton: boolean;
  hideNextButton: boolean;
  hasNext: boolean;
  isNextDataLoading: boolean;
  nextCursor: string | null;
  error: string | null;
  errorType: 'load' | 'delete' | null;
};

const initialState: MultimediaState = {
  multimedia: [],
  isLoading: false,
  selectedMultimedia: null,
  storedSelections: [],
  hidePreviousButton: false,
  hideNextButton: false,
  hasNext: false,
  isNextDataLoading: false,
  nextCursor: null,
  error: null,
  errorType: null,
};

export const MultimediaStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ multimedia }, translateHelper = inject(TranslateHelperService)) => ({
    multimediaCount: computed(() => multimedia().length),
    groupedByMonth: computed(() => {
      const groups = new Map<string, MultimediaResponseDto[]>();
      const lang = translateHelper.currentLang();

      for (const item of multimedia()) {
        if (!item.uploadDate) {
          continue;
        }

        const date = new Date(item.uploadDate);
        const key = date.toLocaleString(lang, {
          year: 'numeric',
          month: 'long',
        });

        if (!groups.has(key)) {
          groups.set(key, []);
        }

        groups.get(key)!.push(item);
      }

      return Array.from(groups.entries()).map(([key, items]) => ({
        key,
        items,
      }));
    }),
  })),
  withMethods(
    (
      store,
      multimediaControllerService = inject(MultimediaControllerService),
      authStore = inject(AuthStore),
      logger = inject(Logger),
    ) => {
      function reset() {
        logger.info('Resetting MultimediaStore to initial state');
        patchState(store, initialState);
      }

      function selectNext() {
        const selectedMultimedia = store.selectedMultimedia();
        if (selectedMultimedia) {
          const multimediaList = store.multimedia();
          const selectedIndex = multimediaList.findIndex((m) => m.id === selectedMultimedia.id);
          if (selectedIndex === -1 || selectedIndex === multimediaList.length - 1) return;
          const nextMultimedia = multimediaList[selectedIndex + 1];
          select(nextMultimedia);
        }
      }

      function selectPrevious() {
        const selectedMultimedia = store.selectedMultimedia();
        if (selectedMultimedia) {
          const multimediaList = store.multimedia();
          const selectedIndex = multimediaList.findIndex((m) => m.id === selectedMultimedia.id);
          if (selectedIndex <= 0) return;
          const previousMultimedia = multimediaList[selectedIndex - 1];
          select(previousMultimedia);
        }
      }

      function select(multimedia: MultimediaResponseDto) {
        const multimediaList = store.multimedia();
        const selectedIndex = multimediaList.findIndex((m) => m.id === multimedia.id);
        patchState(store, {
          selectedMultimedia: multimedia,
          hidePreviousButton: selectedIndex === 0,
          hideNextButton: selectedIndex === multimediaList.length - 1,
        });
      }

      async function loadStartingData() {
        const user = authStore.loginData()?.user;
        if (!user?.id) return;

        patchState(store, {
          isLoading: true,
          error: null,
          errorType: null,
          nextCursor: null,
          hasNext: false,
        });

        logger.info('Loading starting multimedia');
        try {
          const { items, nextCursor, hasNext } = await firstValueFrom(
            multimediaControllerService.getAll1(user.id),
          );
          patchState(store, {
            multimedia: items ?? [],
            nextCursor,
            hasNext,
          });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during multimedia load: ${error}`);
          patchState(store, { error, errorType: 'load' });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function loadNextData() {
        const user = authStore.loginData()?.user;
        if (!user?.id) return;

        const hasNext = store.hasNext();
        const cursor = store.nextCursor();
        if (!hasNext || !cursor) return;

        patchState(store, { isNextDataLoading: true, error: null, errorType: null });
        logger.info('Loading next multimedia data');

        try {
          const {
            items,
            nextCursor,
            hasNext: newHasNext,
          } = await firstValueFrom(multimediaControllerService.getAll1(user.id, cursor));
          patchState(store, {
            multimedia: [...store.multimedia(), ...(items ?? [])],
            nextCursor,
            hasNext: newHasNext,
          });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during multimedia load: ${error}`);
          patchState(store, { error, errorType: 'load' });
        } finally {
          patchState(store, { isNextDataLoading: false });
        }
      }

      function clearError() {
        patchState(store, {
          error: null,
          errorType: null,
          isLoading: false,
          isNextDataLoading: false,
        });
      }

      function storeSelection(id: number) {
        const storedSelections = store.storedSelections();
        if (storedSelections.includes(id)) return;
        patchState(store, { storedSelections: [...storedSelections, id] });
      }

      function removeSelection(id: number) {
        const storedSelections = store.storedSelections();
        const filteredSelections = storedSelections.filter((m) => m !== id);
        patchState(store, { storedSelections: filteredSelections });
      }

      function clearSelections() {
        patchState(store, { storedSelections: [] });
      }

      async function deleteSelectedItems() {
        const previousMultimedia = store.multimedia();
        const selectedIds = store.storedSelections();
        const filteredMultimedia = previousMultimedia.filter(
          (m) => m.id !== undefined && !selectedIds.includes(m.id),
        );

        patchState(store, {
          multimedia: filteredMultimedia,
          storedSelections: [],
          error: null,
          errorType: null,
        });

        try {
          if (filteredMultimedia.length === 0 && store.hasNext()) {
            await loadNextData();
          }
          await firstValueFrom(multimediaControllerService.deleteBatch(selectedIds));
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during multimedia batch delete: ${error}`);
          patchState(store, {
            multimedia: previousMultimedia,
            error,
            errorType: 'delete',
          });
        }
      }

      return {
        reset,
        selectNext,
        selectPrevious,
        select,
        loadStartingData,
        loadNextData,
        storeSelection,
        removeSelection,
        clearSelections,
        clearError,
        deleteSelectedItems,
      };
    },
  ),
  withHooks((store, authStore = inject(AuthStore)) => ({
    onInit() {
      effect(() => {
        const userId = authStore.loginData()?.user?.id;

        untracked(() => {
          if (userId) {
            store.loadStartingData();
          } else {
            store.reset();
          }
        });
      });
    },
  })),
);
