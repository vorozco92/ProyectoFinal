import { Router } from "express";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get("/register", viewsController.viewRegister);
router.get("/login", viewsController.viewLogin);
router.get("/", viewsController.viewProfile);
router.get("/resetpassword/:code", viewsController.viewResetPassword);
router.get("/reset", viewsController.resetBtn);
router.get("/mockingproducts", viewsController.viewMocking);
router.get("/loggerTest", viewsController.viewLogger);

export default router;
