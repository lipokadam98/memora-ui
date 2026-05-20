export * from './authenticationController.service';
import { AuthenticationControllerService } from './authenticationController.service';
export * from './multimediaController.service';
import { MultimediaControllerService } from './multimediaController.service';
export * from './notesController.service';
import { NotesControllerService } from './notesController.service';
export const APIS = [AuthenticationControllerService, MultimediaControllerService, NotesControllerService];
