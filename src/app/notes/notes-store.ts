import { NoteControllerService, NoteRequestDto, NoteResponseDto } from '../api';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { getErrorMessage } from '../util/util';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../authentication/auth-store';

type NotesState = {
  notes: NoteResponseDto[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
  success: false,
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      notesControllerService = inject(NoteControllerService),
      authStore = inject(AuthStore),
    ) => {
      async function loadAll() {
        patchState(store, { isLoading: true, error: null });
        console.log('Loading notes...');
        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const notes = await firstValueFrom(notesControllerService.getAll(user.id));
          console.log(notes);
          patchState(store, { notes });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function create(title: string, content: string) {
        patchState(store, { isLoading: true, error: null });

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
          const createdNote = await firstValueFrom(notesControllerService.create(note));
          patchState(store, { notes: [...store.notes(), createdNote] });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      return {
        loadAll,
        create,
      };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.loadAll();
    },
  })),
);
