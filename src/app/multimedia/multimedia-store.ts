import { MultimediaResponseDto } from '../api';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MultimediaService } from './multimedia-service';
import { inject } from '@angular/core';

type MultimediaState = {
  multimedia: MultimediaResponseDto[];
  searchTerm: string;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadError: string | null;
};

const initialState: MultimediaState = {
  multimedia: [],
  searchTerm: '',
  isLoading: false,
  isUploading: false,
  error: null,
  uploadError: null,
};

export const MultimediaStore = signalStore(
  withState(initialState),
  withMethods((store, multimediaService = inject(MultimediaService)) => ({
    async loadAll() {
      patchState(store, { isLoading: true });
      const multimedia = await multimediaService.loadMultimediaData();
      patchState(store, { multimedia, isLoading: false });
    },
    async uploadMultimedia(files: File[], date: Date) {
      patchState(store, { isUploading: true });
      const uploadedMultimedia = await multimediaService.uploadMultimedia(files, date);
      const multimedia = store.multimedia();
      patchState(store, { multimedia: [...multimedia, ...uploadedMultimedia], isUploading: false });
    },
    async deleteMultimedia(id: number) {
      patchState(store, { isLoading: true });
      await multimediaService.deleteMultimedia(id);
      const filteredMultimedia = store.multimedia().filter((multimedia) => multimedia.id !== id);
      patchState(store, { multimedia: filteredMultimedia, isLoading: false });
    },
  })),
);
