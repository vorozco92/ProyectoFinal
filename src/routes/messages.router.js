import {Router} from "express"
import messagesController from '../controllers/users.controller.js'; 

const router = Router();

router.get('/', messagesController.newUserConnect)

export default router;