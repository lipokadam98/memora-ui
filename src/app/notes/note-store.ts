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
  error: string | null;
  errorType: 'load' | 'delete' | 'create' | null;
};

const initialState: NoteState = {
  notes: [],
  isLoading: false,
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
      async function loadAll() {
        patchState(store, { isLoading: true, error: null, errorType: null });
        logger.info('Loading notes...');
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const notes = await firstValueFrom(noteControllerService.getAll(user.id));
          patchState(store, { notes });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          logger.error(`Error during loading the notes: ${errorMessage}`);
          patchState(store, { error: errorMessage, errorType: 'load' });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function create(title: string, content: string) {
        patchState(store, { isLoading: true, error: null, errorType: null });

        try {
          const user = authStore.loginData()?.user;
          if (!user) {
            return;
          }
          const note: NoteRequestDto = {
            title,
            content,
            user: user,
          };
          const createdNote = await firstValueFrom(noteControllerService.create(note));
          patchState(store, { notes: [...store.notes(), createdNote] });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          logger.error(`Error during saving the note: ${errorMessage}`);
          patchState(store, { error: errorMessage, errorType: 'create' });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function deleteById(id: number) {
        patchState(store, { error: null, errorType: null });
        try {
          await firstValueFrom(noteControllerService._delete(id));
          const notes = store.notes().filter((note) => note.id !== id);
          patchState(store, { notes });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          logger.error(`Error during deleting the note: ${errorMessage}`);
          patchState(store, { error: errorMessage, errorType: 'delete' });
        }
      }

      function clearError() {
        patchState(store, { error: null, errorType: null, isLoading: false });
      }

      return {
        loadAll,
        create,
        deleteById,
        clearError,
      };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.loadAll();
    },
  })),
);
