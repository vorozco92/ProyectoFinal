import { CartsRepository } from "../repositories/Carts.repository.js";
import { ProductsRepository } from "../repositories/Products.repository.js";
import { TicketsRepository } from "../repositories/Tickets.repository.js";
import customError from '../services/errors/customError.js'
import EError from '../services/errors/enum.js'
import { generateCartError } from '../services/errors/info.js'
import MailingService from '../services/mailing.js';

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
        //console.log(cart.products)
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
    //console.log('cid'+cartId+' pid:'+productId);
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
    let cart = await cartsRepository.getCartByIdLean(cartId);
    if (!cart)    
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})

    if (! cart.products.length)
        res.send({status:'error','error_description':`carrito no contiene productos.`})

    let stockDeficit=[], productsNotExists = [],productsDelete = [];
    let totalAmount = 0;
    cart.products.forEach(product =>{

        if (product){
            let stock = product.product.stock;
            if (stock < product.qty)
                stockDeficit.push(product.product._id)
            else{
                let newQuanity = parseInt(stock) - parseInt(product.qty);
                totalAmount += ( parseInt(product.qty) * parseFloat(product.product.price));
                productsDelete.push(product.product._id);
                cartsRepository.deleteProductInCartById(cartId, product.product._id);
                productsRepository.updateProduct(String(product.product._id), {'stock': newQuanity});
            }
        }
        else
            productsNotExists.push(String(product.product._id));

    });

   console.log('STOKC DEFICIT')
   console.log(stockDeficit)
   console.log('SproductsNotExists')
   console.log(productsNotExists)
   console.log(productsDelete);

    let uID = Math.random(10000).toString();
    uID = uID.replace('.','');
    let newTicket = {
        code: uID.padStart((12 - uID.length), '0'),
        amount : totalAmount,
        purchaser: req.session.user.email,
        purchase_datetime: new Date().toLocaleDateString()+ ' '+new Date().toLocaleTimeString()
    }

    let ticketResult = await ticketsRepository.saveTicket(newTicket);
    
    if (ticketResult){
        const mailer = new MailingService();
        const result = await mailer.sendSimpleMail({
            from:'Ecommerce',
            to: req.session.user.email,
            subject:"Compra exitosa",
            html:`<div><h1>Hola ${req.session.user.name}!</h1>
            <br>
            <p> Tu ticket de compra es: <b>${ticketResult.code}</b></p>
            <p>Total compra : <b>$ ${totalAmount}</b></p>
            <br>
            <h4>!Gracias por tu compra!</h4>
            </div>`
        })

        res.status(200).send({status:'success',ticket: ticketResult})
    }
    else
        res.status(500).send({status:'error', error_message: 'Sucedio un error al procesar la compra.'})
       
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