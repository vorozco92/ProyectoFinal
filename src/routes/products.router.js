import { Router } from "express"
import applyPolicy from '../middleware/auth.middleware.js';
import productsController from '../controllers/products.controller.js';

const router = Router();

//router.use(passport.authenticate('api/sessions/current',{session:false}))

router.get('/', applyPolicy(['USER']), productsController.getProducts)
router.post('/', productsController.addProduct)
router.get('/:id', productsController.getProductById)
router.put('/:id', applyPolicy(['ADMIN']), productsController.updateProduct)
router.delete('/:id', applyPolicy(['ADMIN']), productsController.deleteProduct);

export default router;