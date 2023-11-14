import { Router } from "express";
import usersController from '../controllers/users.controller.js'; 
import uploader from '../utils/utils.js';
const router = Router();

router.post("/premium/:uid", usersController.updateRolUser);
//router.post("/:uid/documents",uploader.single('doc_file'), usersController.updateRolUser);
//router.post("/:uid/profile", uploader.single('image_profile'), usersController.updateUserProfile);
//router.post('/withimage',uploader.single('image'), petsController.createPetWithImage);
export default router;
