export * from './authenticationController.service';
import { AuthenticationControllerService } from './authenticationController.service';
export * from './multimediaController.service';
import { MultimediaControllerService } from './multimediaController.service';
export * from './noteController.service';
import { NoteControllerService } from './noteController.service';
export const APIS = [AuthenticationControllerService, MultimediaControllerService, NoteControllerService];
