import { Injectable } from '@angular/core';
import notes from '../dummy-data/notes.json';

export interface Note {
  id: string;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  async loadNotes(): Promise<Note[]> {
    return notes;
  }
}
