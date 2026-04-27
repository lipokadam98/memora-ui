import { MultimediaControllerService, MultimediaResponseDto } from '../api';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { getErrorMessage } from '../util/util';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../authentication/auth-store';
import { TranslateHelperService } from '../util/translate-helper-service';

type MultimediaState = {
  multimedia: MultimediaResponseDto[];
  searchTerm: string;
  isLoading: boolean;
  selectedMultimedia: MultimediaResponseDto | null;
  hidePreviousButton: boolean;
  hideNextButton: boolean;
  hasNext: boolean;
  isNextDataLoading: boolean;
  nextCursor: string | null;
  error: string | null;
};

const initialState: MultimediaState = {
  multimedia: [],
  searchTerm: '',
  isLoading: false,
  selectedMultimedia: null,
  hidePreviousButton: false,
  hideNextButton: false,
  hasNext: false,
  isNextDataLoading: false,
  nextCursor: null,
  error: null,
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

        // Now uses the dynamic language signal
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
    ) => {
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
        patchState(store, { isLoading: true, error: null });
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const { items, nextCursor, hasNext } = await firstValueFrom(
            multimediaControllerService.getAll(user.id),
          );
          patchState(store, {
            multimedia: items,
            nextCursor,
            hasNext,
          });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function loadNextData() {
        patchState(store, { isNextDataLoading: true, error: null });
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const hasNext = store.hasNext();
          const cursor = store.nextCursor();
          if (hasNext && cursor) {
            const { items, nextCursor, hasNext } = await firstValueFrom(
              multimediaControllerService.getAll(user.id, cursor),
            );
            if (items)
              patchState(store, {
                multimedia: [...store.multimedia(), ...items],
                nextCursor,
                hasNext,
              });
          }
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isNextDataLoading: false });
        }
      }

      function addMultimedia(multimedia: MultimediaResponseDto[]) {
        patchState(store, {
          multimedia: [...store.multimedia(), ...multimedia],
        });
      }

      async function remove(id: number) {
        patchState(store, { error: null });
        try {
          await firstValueFrom(multimediaControllerService._delete(id));
          const filteredMultimedia = store
            .multimedia()
            .filter((multimedia) => multimedia.id !== id);
          patchState(store, {
            multimedia: filteredMultimedia,
          });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        }
      }

      function clearError() {
        patchState(store, { error: null, isLoading: false, isNextDataLoading: false });
      }

      return {
        selectNext,
        selectPrevious,
        select,
        loadStartingData,
        loadNextData,
        addMultimedia,
        remove,
        clearError,
      };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.loadStartingData();
    },
  })),
);
