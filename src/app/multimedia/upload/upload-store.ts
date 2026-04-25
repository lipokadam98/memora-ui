import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { MultimediaControllerService, ThumbnailCreationRequestDto } from '../../api';
import { firstValueFrom } from 'rxjs';
import { getErrorMessage } from '../../util/util';
import { MultimediaStore } from '../multimedia-store';
import { AuthStore } from '../../authentication/auth-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      http = inject(HttpClient),
    ) => {
      async function upload(files: File[], date: Date) {
        const user = authStore.loginData()?.user;
        patchState(store, { isUploading: true, error: null, success: false });

        try {
          const requestDtoList = files.map((file) => ({
            user,
            uploadDate: date.toISOString(),
            size: file.size,
            contentType: file.type,
            originalFileName: file.name,
          }));

          const uploadedMultimedia = await firstValueFrom(
            multimediaControllerService.create(requestDtoList),
          );
          console.log('Uploaded multimedia: ', uploadedMultimedia);
          const uploadResults = await Promise.all(
            files.map(async (file) => {
              const metadata = uploadedMultimedia.find((d) => d.originalFileName === file.name);

              const status = metadata?.signedUrl
                ? await uploadToStorage(file, metadata.signedUrl)
                : 'FAILED';

              return { id: metadata?.id, status };
            }),
          );

          console.log('Upload results: ', uploadResults);

          const thumbnailCreationArray: ThumbnailCreationRequestDto[] = uploadResults.map(
            (res) => ({
              id: res.id,
              status: res.status,
            }),
          );

          const thumbnailCreation = await firstValueFrom(
            multimediaControllerService.createThumbnails(thumbnailCreationArray),
          );

          console.log('Thumbnail creation result:', thumbnailCreation);
          await multimediaStore.loadStartingData();
          patchState(store, { success: true });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error), success: false });
        } finally {
          patchState(store, { isUploading: false });
        }
      }

      async function uploadToStorage(file: File, signedUrl: string): Promise<'DONE' | 'FAILED'> {
        const headers = new HttpHeaders({ 'Content-Type': file.type });

        try {
          const response = await firstValueFrom(
            http.put(signedUrl, file, { headers, observe: 'response' }),
          );

          return response.status >= 200 && response.status < 300 ? 'DONE' : 'FAILED';
        } catch {
          return 'FAILED';
        }
      }

      return { upload };
    },
  ),
);
