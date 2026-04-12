import { MultimediaResponseDto } from '../api';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MultimediaService } from './multimedia-service';
import { inject } from '@angular/core';

type MultimediaState = {
  multimedia: MultimediaResponseDto[];
  searchTerm: string;
  isLoading: boolean;
  isUploading: boolean;
  selectedMultimedia: MultimediaResponseDto | null;
  error: string | null;
  uploadError: string | null;
};

const initialState: MultimediaState = {
  multimedia: [],
  searchTerm: '',
  isLoading: false,
  isUploading: false,
  selectedMultimedia: null,
  error: null,
  uploadError: null,
};

export const MultimediaStore = signalStore(
  withState(initialState),
  withMethods((store, multimediaService = inject(MultimediaService)) => ({
    selectNextMultimedia() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const selectedIndex = store.multimedia().indexOf(selectedMultimedia);
        if (selectedIndex === store.multimedia().length - 1) return;
        const nextMultimedia = store.multimedia()[selectedIndex + 1];
        patchState(store, { selectedMultimedia: nextMultimedia });
      }
    },
    selectPreviousMultimedia() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const selectedIndex = store.multimedia().indexOf(selectedMultimedia);
        if (selectedIndex === 0) return;
        const previousMultimedia = store.multimedia()[selectedIndex - 1];
        patchState(store, { selectedMultimedia: previousMultimedia });
      }
    },
    selectMultimedia(multimedia: MultimediaResponseDto) {
      patchState(store, { selectedMultimedia: multimedia });
    },
    async loadAll() {
      patchState(store, { isLoading: true, error: null });

      try {
        const multimedia = await multimediaService.loadMultimediaData();
        patchState(store, { multimedia });
      } catch (error: unknown) {
        patchState(store, { error: getErrorMessage(error) });
      } finally {
        patchState(store, { isLoading: false });
      }
    },
    async uploadMultimedia(files: File[], date: Date) {
      patchState(store, { isUploading: true, uploadError: null });
      try {
        const uploadedMultimedia = await multimediaService.uploadMultimedia(files, date);
        const multimedia = store.multimedia();
        patchState(store, {
          multimedia: [...multimedia, ...uploadedMultimedia],
        });
      } catch (error: unknown) {
        patchState(store, { uploadError: getErrorMessage(error) });
      } finally {
        patchState(store, { isUploading: false });
      }
    },
    async deleteMultimedia(id: number) {
      patchState(store, { isLoading: true, error: null });
      try {
        await multimediaService.deleteMultimedia(id);
        const filteredMultimedia = store.multimedia().filter((multimedia) => multimedia.id !== id);
        patchState(store, { multimedia: filteredMultimedia, isLoading: false });
      } catch (error: unknown) {
        patchState(store, { error: getErrorMessage(error) });
      } finally {
        patchState(store, { isLoading: false });
      }
    },
  })),
);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}
