export * from './authenticationController.service';
import { AuthenticationControllerService } from './authenticationController.service';
export * from './multimediaController.service';
import { MultimediaControllerService } from './multimediaController.service';
export const APIS = [AuthenticationControllerService, MultimediaControllerService];
