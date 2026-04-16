import { MultimediaControllerService, MultimediaResponseDto, UserDto } from '../api';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { getErrorMessage } from '../util/util';
import { firstValueFrom } from 'rxjs';

type MultimediaState = {
  multimedia: MultimediaResponseDto[];
  searchTerm: string;
  isLoading: boolean;
  isUploading: boolean;
  selectedMultimedia: MultimediaResponseDto | null;
  hidePreviousButton: boolean;
  hideNextButton: boolean;
  error: string | null;
  uploadError: string | null;
};

const initialState: MultimediaState = {
  multimedia: [],
  searchTerm: '',
  isLoading: false,
  isUploading: false,
  selectedMultimedia: null,
  hidePreviousButton: false,
  hideNextButton: false,
  error: null,
  uploadError: null,
};

export const MultimediaStore = signalStore(
  withState(initialState),
  withMethods((store, multimediaControllerService = inject(MultimediaControllerService)) => ({
    selectNextMultimedia() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const selectedIndex = store.multimedia().indexOf(selectedMultimedia);
        if (selectedIndex === store.multimedia().length - 1) return;
        const nextMultimedia = store.multimedia()[selectedIndex + 1];
        this.selectMultimedia(nextMultimedia);
      }
    },
    selectPreviousMultimedia() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const selectedIndex = store.multimedia().indexOf(selectedMultimedia);
        if (selectedIndex === 0) return;
        const previousMultimedia = store.multimedia()[selectedIndex - 1];
        this.selectMultimedia(previousMultimedia);
      }
    },
    selectMultimedia(multimedia: MultimediaResponseDto) {
      const selectedIndex = store.multimedia().indexOf(multimedia);
      patchState(store, {
        selectedMultimedia: multimedia,
        hidePreviousButton: selectedIndex === 0,
        hideNextButton: selectedIndex === store.multimedia().length - 1,
      });
    },
    async loadAll() {
      patchState(store, { isLoading: true, error: null });

      try {
        const multimedia = await firstValueFrom(multimediaControllerService.getAll());
        patchState(store, { multimedia });
      } catch (error: unknown) {
        patchState(store, { error: getErrorMessage(error) });
      } finally {
        patchState(store, { isLoading: false });
      }
    },
    async uploadMultimedia(files: File[], date: Date, user?: UserDto) {
      patchState(store, { isUploading: true, uploadError: null });
      try {
        const uploadedMultimedia = await firstValueFrom(
          multimediaControllerService.create(files, {
            user,
            uploadDate: date.toISOString(),
          }),
        );
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
      patchState(store, { error: null });
      try {
        await firstValueFrom(multimediaControllerService._delete(id));
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
