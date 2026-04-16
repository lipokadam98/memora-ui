import { MultimediaControllerService, MultimediaResponseDto, UserDto } from '../api';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
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
  withMethods((store, multimediaControllerService = inject(MultimediaControllerService)) => {
    function selectNext() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const multimediaList = store.multimedia();
        const selectedIndex = multimediaList.findIndex((m) => m.id === selectedMultimedia.id);
        if (selectedIndex === -1 || selectedIndex === multimediaList.length - 1) return;
        const nextMultimedia = multimediaList[selectedIndex + 1];
        select(nextMultimedia);
      }
    }

    function selectPrevious() {
      const selectedMultimedia = store.selectedMultimedia();
      if (selectedMultimedia) {
        const multimediaList = store.multimedia();
        const selectedIndex = multimediaList.findIndex((m) => m.id === selectedMultimedia.id);
        if (selectedIndex <= 0) return;
        const previousMultimedia = multimediaList[selectedIndex - 1];
        select(previousMultimedia);
      }
    }

    function select(multimedia: MultimediaResponseDto) {
      const multimediaList = store.multimedia();
      const selectedIndex = multimediaList.findIndex((m) => m.id === multimedia.id);
      patchState(store, {
        selectedMultimedia: multimedia,
        hidePreviousButton: selectedIndex === 0,
        hideNextButton: selectedIndex === multimediaList.length - 1,
      });
    }

    async function loadAll() {
      patchState(store, { isLoading: true, error: null });
      try {
        const multimedia = await firstValueFrom(multimediaControllerService.getAll());
        patchState(store, { multimedia });
      } catch (error: unknown) {
        patchState(store, { error: getErrorMessage(error) });
      } finally {
        patchState(store, { isLoading: false });
      }
    }

    async function upload(files: File[], date: Date, user?: UserDto) {
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
    }

    async function remove(id: number) {
      patchState(store, { error: null });
      try {
        await firstValueFrom(multimediaControllerService._delete(id));
        const filteredMultimedia = store.multimedia().filter((multimedia) => multimedia.id !== id);
        patchState(store, {
          multimedia: filteredMultimedia,
        });
      } catch (error: unknown) {
        patchState(store, { error: getErrorMessage(error) });
      }
    }

    function clearError() {
      patchState(store, { error: null });
    }

    return {
      selectNext,
      selectPrevious,
      select,
      loadAll,
      upload,
      remove,
      clearError,
    };
  }),
  withHooks((store) => ({
    onInit() {
      store.loadAll();
    },
  })),
);
