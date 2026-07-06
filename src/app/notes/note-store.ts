import { NoteControllerService, NoteRequestDto, NoteResponseDto } from '../api';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { getErrorMessage } from '../util/util';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../authentication/auth-store';
import { Logger } from '../util/logger';

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
      async function loadStartingData() {
        patchState(store, { isLoading: true, error: null, errorType: null });
        logger.info('Loading notes');
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const { items, nextCursor, hasNext } = await firstValueFrom(
            noteControllerService.getAll(user.id),
          );
          patchState(store, { notes: items, nextCursor, hasNext });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during loading the notes: ${error}`);
          patchState(store, { error, errorType: 'load' });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function loadNextData() {
        patchState(store, { isNextDataLoading: true, error: null, errorType: null });
        logger.info('Loading next notes data');
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const hasNext = store.hasNext();
          const cursor = store.nextCursor();
          if (hasNext && cursor) {
            const { items, nextCursor, hasNext } = await firstValueFrom(
              noteControllerService.getAll(user.id, cursor),
            );
            if (items)
              patchState(store, {
                notes: [...store.notes(), ...items],
                nextCursor,
                hasNext,
              });
          }
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during notes load: ${error}`);
          patchState(store, { error, errorType: 'load' });
        } finally {
          patchState(store, { isNextDataLoading: false });
        }
      }

      async function create(title: string, content: string) {
        patchState(store, { error: null, errorType: null });

        try {
          const user = authStore.loginData()?.user;
          if (!user) {
            return;
          }
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
        loadStartingData,
        loadNextData,
        create,
        deleteById,
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
