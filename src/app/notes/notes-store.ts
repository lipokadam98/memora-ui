import { Notes, NotesControllerService } from '../api';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { getErrorMessage } from '../util/util';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../authentication/auth-store';

type NotesState = {
  notes: Notes[] | undefined;
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
      notesControllerService = inject(NotesControllerService),
      authStore = inject(AuthStore),
    ) => {
      async function loadAll() {
        patchState(store, { isLoading: true, error: null });

        try {
          const user = authStore.loginData()?.user;
          if (!user?.id) {
            return;
          }
          const notes = await firstValueFrom(notesControllerService.getAll(user.id));
          patchState(store, { notes });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function create(note: Notes) {}

      return {
        loadAll,
        create,
      };
    },
  ),
);
