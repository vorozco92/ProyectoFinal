import { CartsRepository } from "../repositories/Carts.repository.js";
import { ProductsRepository } from "../repositories/Products.repository.js";
import { TicketsRepository } from "../repositories/Tickets.repository.js";
import customError from '../services/errors/customError.js'
import EError from '../services/errors/enum.js'
import { generateCartError } from '../services/errors/info.js'

const cartsRepository = new CartsRepository()
const productsRepository = new ProductsRepository()
const ticketsRepository = new TicketsRepository()

const getAllCarts = async(req,res)=>{
    let carts = await cartsRepository.getAllCarts();
    res.status(200).send({status:'success',carts:carts})
}

const createCart = async(req,res)=>{
    const {products} = req.body;
    let cart = {};
    cart.user = req.session.user.id;
    
    if (products)
        cart.products = products

    let result =await cartsRepository.saveCart(cart)
    res.send({status:'success',cart:result})
}

const getCartById = async(req, res)=>{
    let cartId = req.params.id;
    req.logger.debug(`cartId ${cartId} at ${req.url} - ${new Date().toLocaleTimeString()}`);
    let cart = await cartsRepository.getCartByIdLean(cartId);
    let total = 0;
    if (cart){
       // console.log(cart.products)
        cart.products.forEach( prod =>{ let subtotal = (prod.product.price * prod.qty); prod.subtotal = subtotal;  total += subtotal});
        res.render('carts',{status:'success','total': total, 'cartId': cart._id,products:cart.products})}
    else
        res.status(401).send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
}

const addProductToCart = async(req, res)=>{
    let cartId = req.params.id;
    let productId = req.body.productId;
    let productQty = req.body.qty;
    //console.log(req.body);
    let cart = await cartsRepository.getCartById(cartId);

    if (cart){

        let product = await productsRepository.getProductById(productId);
        if (! product) 
            customError.createError({
                name: " Error al agregar el producto, no existe",
                cause: generateCartError(),
                message:" Fallo al agregar el producto, no existe",
                code: EError.INVALID_TYPES_ERROR
            })
        
        let products = cart.products;
        let pFound = products.findIndex(e =>{ /*console.log(String(e.product._id)+' == '+String(productId));*/  return (String(e.product._id) === String(productId));});
        //console.log(pFound);
        if (pFound !== -1){
            products[pFound].qty = parseInt(products[pFound].qty) + parseInt(productQty);
        }
        else{
            products.push({'product':`${productId}`, 'qty': productQty})
        }

        let cartEdit = await cartsRepository.updateCartById(cartId,  products);
        res.send({status:'success',cart:cartEdit})
    }
    else{
        customError.createError({
            name: " Error al agregar el producto",
            cause: generateCartError(),
            message:" Fallo al agregar el producto",
            code: EError.INVALID_TYPES_ERROR
        })
    }
        //res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
}

const deleteProductInCart =async(req, res)=>{
    let cartId = req.params.id;
    let productId = req.params.pid;
    console.log('cid'+cartId+' pid:'+productId);
    let cart = await cartsRepository.getCartById(cartId);
    let cartEdit = false; 
    if (cart){
        
        let cartEdit = await cartsRepository.deleteProductInCartById(cartId, productId);
        if (cartEdit)
            res.status(200).send({status:'success', cart: cartEdit});
        else
            res.status(500).send({status:'error','error_description':`Error al eliminar el producto.`})
    }
        
}

const updateProductInCart = async(req, res)=>{
    let cartId = req.params.id;
    let productId = req.params.pid;
    let {qty} = req.body;
    let cart = await cartsRepository.getCartById(cartId);
    if (cart){
        let cartEdit = await cartsRepository.updateProductInCartById(cartId, productId, qty);
        res.send({status:'success', cart: cartEdit});
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
}

const deleteProductsInCart = async(req, res)=>{
    let cartId = req.params.id;
    let cart = await cartsRepository.getCartById(cartId);
    if (cart){
        let cartR = await cartsRepository.deleteProductsInCart(cartId);
        res.send({status:'success', cart: cartR});
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
}

const addPurchase =async(req, res)=>{
    let cartId = req.params.id;
    let cart = await cartsRepository.getCartByIdPopulate(cartId);
    if (!cart)    
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})

    if (! cart.products)
        res.send({status:'error','error_description':`carrito no contiene productos.`})

    let stockDeficit, productsNotExists = [];
    let totalAmount = 0;
    cart.products.forEach(product => {
        let productStorage = productsRepository.getProductById(product._id);

        if (productStorage){
            if (productStorage.quanity < product.qty)
                stockDeficit.push(product._id)
            else{
                productStorage.quanity = productStorage.quanity - product.qty;
                totalAmount += ( product.qty * productStorage.price);
            }
        }
        else
            productsNotExists.push(product._id);

    });

    if (! totalAmount)
        res.send({status:'error','error_description':`carrito no contiene productos.`})

    let uID = Math.random(10000);
    let newTicket = {
        code: uID.padStart((12 - uID.length), '0'),
        amount : totalAmount,
        purcharser: req.session.email,

    }

    let ticketResult = await ticketsRepository.saveTicket(newTicket);
    
    res.render('carts',{status:'success',ticket: ticketResult})
       
}

export default{
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
    deleteProductInCart,
    updateProductInCart,
    deleteProductsInCart,
    addPurchase
}