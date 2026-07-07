import { effect, inject, untracked } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { NoteControllerService, NoteRequestDto, NoteResponseDto } from '../api';
import { AuthStore } from '../authentication/auth-store';
import { Logger } from '../util/logger';
import { getErrorMessage } from '../util/util';

type NoteState = {
  notes: NoteResponseDto[];
  isLoading: boolean;
  hasNext: boolean;
  nextCursor: string | null;
  isNextDataLoading: boolean;
  error: string | null;
  errorType: 'load' | 'delete' | 'create' | null;
};

const initialState: NoteState = {
  notes: [],
  isLoading: false,
  hasNext: false,
  isNextDataLoading: false,
  nextCursor: null,
  error: null,
  errorType: null,
};

export const NoteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      noteControllerService = inject(NoteControllerService),
      authStore = inject(AuthStore),
      logger = inject(Logger),
    ) => {
      function reset() {
        logger.info('Resetting NoteStore to initial state');
        patchState(store, initialState);
      }

      async function loadStartingData() {
        const user = authStore.loginData()?.user;
        if (!user?.id) return;

        patchState(store, { isLoading: true, error: null, errorType: null });
        logger.info('Loading notes');

        try {
          const { items, nextCursor, hasNext } = await firstValueFrom(
            noteControllerService.getAll(user.id),
          );
          patchState(store, {
            notes: items ?? [],
            nextCursor,
            hasNext,
          });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during loading the notes: ${error}`);
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
        logger.info('Loading next notes data');

        try {
          const {
            items,
            nextCursor,
            hasNext: newHasNext,
          } = await firstValueFrom(noteControllerService.getAll(user.id, cursor));
          patchState(store, {
            notes: [...store.notes(), ...(items ?? [])],
            nextCursor,
            hasNext: newHasNext,
          });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during notes load: ${error}`);
          patchState(store, { error, errorType: 'load' });
        } finally {
          patchState(store, { isNextDataLoading: false });
        }
      }

      async function create(title: string, content: string) {
        const user = authStore.loginData()?.user;
        if (!user?.id) return;

        patchState(store, { error: null, errorType: null });

        try {
          const note: NoteRequestDto = {
            title,
            content,
            userId: user.id,
          };
          const createdNote = await firstValueFrom(noteControllerService.create(note));
          patchState(store, { notes: [...store.notes(), createdNote] });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during saving the note: ${error}`);
          patchState(store, { error, errorType: 'create' });
        }
      }

      async function deleteById(id: number) {
        patchState(store, { error: null, errorType: null });
        try {
          await firstValueFrom(noteControllerService._delete(id));
          const notes = store.notes().filter((note) => note.id !== id);
          patchState(store, { notes });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during deleting the note: ${error}`);
          patchState(store, { error, errorType: 'delete' });
        }
      }

      function clearError() {
        patchState(store, { error: null, errorType: null, isLoading: false });
      }

      return {
        reset,
        loadStartingData,
        loadNextData,
        create,
        deleteById,
        clearError,
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
