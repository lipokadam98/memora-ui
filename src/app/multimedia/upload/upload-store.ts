import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import {
  MultimediaControllerService,
  MultimediaResponseDto,
  ThumbnailCreationRequestDto,
} from '../../api';
import { firstValueFrom } from 'rxjs';
import { getErrorMessage } from '../../util/util';
import { MultimediaStore } from '../multimedia-store';
import { AuthStore } from '../../authentication/auth-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type UploadState = {
  selectedFiles: File[];
  isUploading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: UploadState = {
  selectedFiles: [],
  isUploading: false,
  error: null,
  success: false,
};

export const UploadStore = signalStore(
  withState(initialState),
  withComputed(({ selectedFiles }) => ({
    fileSize: computed(() => {
      const totalBytes = selectedFiles().reduce((acc, file) => acc + file.size, 0);
      return (totalBytes / 1024 ** 2).toFixed(2);
    }),
  })),
  withMethods(
    (
      store,
      multimediaControllerService = inject(MultimediaControllerService),
      multimediaStore = inject(MultimediaStore),
      authStore = inject(AuthStore),
      http = inject(HttpClient),
    ) => {
      async function upload(date: Date) {
        const user = authStore.loginData()?.user;
        patchState(store, { isUploading: true, error: null, success: false });

        try {
          const requestDtoList = store.selectedFiles().map((file) => ({
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

          const uploadResults = await callStorageUploadForMultimediaItems(uploadedMultimedia);

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
          multimediaStore.addMultimedia(thumbnailCreation);
          patchState(store, { success: true });
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error), success: false });
        } finally {
          patchState(store, { isUploading: false });
        }
      }

      async function callStorageUploadForMultimediaItems(
        uploadedMultimedia: MultimediaResponseDto[],
      ) {
        return await Promise.all(
          store.selectedFiles().map(async (file) => {
            const metadata = uploadedMultimedia.find((d) => d.originalFileName === file.name);

            const status = metadata?.signedUrl
              ? await uploadToStorage(file, metadata.signedUrl)
              : 'FAILED';

            return { id: metadata?.id, status };
          }),
        );
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

      function setSelectedFiles(files: File[]) {
        patchState(store, { selectedFiles: files });
      }

      function clearSelectedFiles() {
        patchState(store, { selectedFiles: [] });
      }

      return { upload, setSelectedFiles, clearSelectedFiles };
    },
  ),
);
