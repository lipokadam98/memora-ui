export * from './multimediaController.service';
import { MultimediaControllerService } from './multimediaController.service';
export * from './storageController.service';
import { StorageControllerService } from './storageController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [MultimediaControllerService, StorageControllerService, UserControllerService];
