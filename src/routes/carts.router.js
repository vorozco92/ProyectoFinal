import { Router } from "express"
import applyPolicy from '../middleware/auth.middleware.js';
import cartsController from '../controllers/carts.controller.js'; 

const router = Router();

router.get('/', cartsController.getAllCarts)
router.post('/', applyPolicy(['USER']), cartsController.createCart)
router.get('/:id', cartsController.getCartById)
router.put('/:id', cartsController.addProductToCart)
router.delete('/:id', cartsController.deleteProductsInCart)
router.delete('/:id/products/:pid', cartsController.deleteProductInCart)
router.put('/:id/products/:pid', cartsController.updateProductInCart)
router.post('/:id/purchase', cartsController.addPurchase)

export default router;