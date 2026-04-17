import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { MultimediaControllerService } from '../../api';
import { firstValueFrom } from 'rxjs';
import { getErrorMessage } from '../../util/util';
import { MultimediaStore } from '../multimedia-store';
import { AuthStore } from '../../authentication/auth-store';

type UploadState = {
  isUploading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: UploadState = {
  isUploading: false,
  error: null,
  success: false,
};

export const UploadStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      multimediaControllerService = inject(MultimediaControllerService),
      multimediaStore = inject(MultimediaStore),
      authStore = inject(AuthStore),
    ) => {
      async function upload(files: File[], date: Date) {
        patchState(store, { isUploading: true, error: null, success: false });
        try {
          const user = authStore.loginData()?.user;
          const uploadedMultimedia = await firstValueFrom(
            multimediaControllerService.create(files, {
              user,
              uploadDate: date.toISOString(),
            }),
          );
          multimediaStore.addMultimedia(uploadedMultimedia);
          patchState(store, { success: true });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isUploading: false });
        }
      }

      return {
        upload,
      };
    },
  ),
);
