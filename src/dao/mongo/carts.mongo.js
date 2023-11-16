import cartsModel from "../../models/schemas/carts.schema.js";

export class Carts{

    constructor(){
        console.log("Estamos trabajando en db mongo");
    }

    get=async()=>{
        let carts = await cartsModel.find().lean();
        return carts
    }

    save = async cart=> {
        let result = await cartsModel.create(cart)
        return result
    }

    getIdCart = async() =>{
        let endCart = await cartsModel.findOne().sort([['_id', 'desc']]);
        if (endCart)
            return endCart.id+1;
        return 1;
    }

    getCartById = async(id) =>{
        let cart = await cartsModel.findOne({'_id': id}).populate('products.product');
        return cart;
    }

    getCartByIdLean = async(id) =>{
        let cart = await cartsModel.findOne({'_id': id}).populate('products.product').lean();
        return cart;
    }

    getCartByIdUser = async(user_id) =>{
        let cart = await cartsModel.findOne({'user': user_id}).populate('products');
        console.log('cart'+cart);
        //console.log(JSON.stringify(cart, null, "\t"));
        return cart;
    }
    getCartByIdPopulate = async(id) =>{
        let cart = await cartsModel.findOne({'_id': id}).populate('products');
        console.log(cart);
        //console.log(JSON.stringify(cart, null, "\t"));
        return cart;
    }

    updateCartById = async(id, products)=> {
        let cart = await cartsModel.findOne({'_id': id})
        cart.products = products;
        cart.save();
        return cart
    }

    deleteProductInCartById = async(cartId,productId) =>{
        
        let cart = await this.getCartById(cartId)
        if (cart){
            //console.log('cart_-->'+cart);
            let products = cart.products;
            let pIndex = products.findIndex(e =>{ return (String(e.product._id) === String(productId));});
            if (pIndex !== -1){
                products.splice(pIndex, 1)
                cart = await cartsModel.updateOne({_id: cartId}, {products: products});
                return true;
            }
                
        }
        return false;
    }

    updateProductInCartById = async(cartId,productId, qty) =>{
        let cart = await cartsModel.findOne({'_id': cartId})
        if (cart){
            let products = cart.products;
            let pIndex  = products.findIndex(prod => parseInt(prod._id) === parseInt(productId));
            if (pIndex !== -1){
                products[pIndex].qty = qty; 
                cart.products =  products
                cart.save()
                //cart = await cartsModel.updateOne({_id: cartId}, cartUpdate);
            }      
        }
        return cart;
    }

    deleteProductsInCart = async(cartId) =>{
        let cart = await cartsModel.findOne({'_id': cartId})
        if (cart){
            cart.products = [];
            cart.save(); 
        }
        return cart;
    }    
}