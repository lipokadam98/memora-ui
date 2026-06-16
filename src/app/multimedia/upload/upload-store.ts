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
import { Logger } from '../../util/logger';

type UploadState = {
  selectedFiles: File[];
  isUploading: boolean;
  uploadStage: 'IDLE' | 'STORING' | 'THUMBNAILS';
  uploadedCount: number;
  error: string | null;
  success: boolean;
};

const initialState: UploadState = {
  selectedFiles: [],
  isUploading: false,
  uploadStage: 'IDLE',
  uploadedCount: 0,
  error: null,
  success: false,
};

export const UploadStore = signalStore(
  withState(initialState),
  withComputed(({ selectedFiles, uploadedCount }) => ({
    fileSize: computed(() => {
      const totalBytes = selectedFiles().reduce((acc, file) => acc + file.size, 0);
      return (totalBytes / 1024 ** 2).toFixed(2);
    }),
    totalFilesCount: computed(() => selectedFiles().length),
    uploadProgressText: computed(() => `${uploadedCount()} / ${selectedFiles().length}`),
  })),
  withMethods(
    (
      store,
      multimediaControllerService = inject(MultimediaControllerService),
      multimediaStore = inject(MultimediaStore),
      authStore = inject(AuthStore),
      http = inject(HttpClient),
      logger = inject(Logger),
    ) => {
      async function upload(date: Date) {
        const user = authStore.loginData()?.user;

        patchState(store, {
          isUploading: true,
          uploadStage: 'STORING',
          error: null,
          success: false,
          uploadedCount: 0,
        });

        try {
          const requestDtoList = store.selectedFiles().map((file) => ({
            user,
            uploadDate: date.toISOString(),
            size: file.size,
            contentType: file.type,
            originalFileName: file.name,
          }));

          const uploadedMultimedia = await firstValueFrom(
            multimediaControllerService.create1(requestDtoList),
          );

          logger.info(`Uploaded multimedia metadata created: ${uploadedMultimedia.length} items`);

          const uploadResults = await callStorageUploadForMultimediaItems(uploadedMultimedia);

          patchState(store, { uploadStage: 'THUMBNAILS' });

          const thumbnailCreationArray: ThumbnailCreationRequestDto[] = uploadResults
            .filter((res) => res.id !== undefined)
            .map((res) => ({
              id: res.id!,
              status: res.status,
            }));

          await firstValueFrom(
            multimediaControllerService.createThumbnails(thumbnailCreationArray),
          );

          logger.info(`Thumbnail creation result complete.`);
          await multimediaStore.loadStartingData();
          patchState(store, { success: true });
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during upload sequence: ${error}`);
          patchState(store, { error, success: false });
        } finally {
          patchState(store, { isUploading: false, uploadStage: 'IDLE' });
        }
      }

      async function callStorageUploadForMultimediaItems(
        uploadedMultimedia: MultimediaResponseDto[],
      ) {
        let localCompletedCounter = 0;

        return await Promise.all(
          store.selectedFiles().map(async (file, index) => {
            const metadata = uploadedMultimedia[index];

            let status: 'DONE' | 'FAILED' = 'FAILED';

            if (metadata?.signedUrl) {
              status = await uploadToStorage(file, metadata.signedUrl);

              if (status === 'DONE') {
                localCompletedCounter++;
                patchState(store, { uploadedCount: localCompletedCounter });
              }
            } else {
              logger.warn(`Missing signed URL for file at index: ${index}`);
            }

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
        } catch (err) {
          logger.error(`Storage provider HTTP failure for file ${file.name}`);
          return 'FAILED';
        }
      }

      function setSelectedFiles(files: File[]) {
        patchState(store, {
          selectedFiles: files,
          uploadedCount: 0,
          uploadStage: 'IDLE',
          success: false,
          error: null,
        });
      }

      function clearSelectedFiles() {
        patchState(store, {
          selectedFiles: [],
          uploadedCount: 0,
          uploadStage: 'IDLE',
          success: false,
          error: null,
        });
      }

      return { upload, setSelectedFiles, clearSelectedFiles };
    },
  ),
);
