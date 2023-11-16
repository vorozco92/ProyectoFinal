import getDAOS from "../dao/factory.js";
import CartDTO from "../dto/Cart.dto.js";

const { cartsDAO } = getDAOS();

export class CartsRepository{

    constructor(){
        this.dao = cartsDAO;
    }

    async getAllCarts(){
        return await this.dao.get();
    }

    async saveCart(payload){
        const cartPayload =  CartDTO.getCartInputFrom(payload)
        return await this.dao.save(cartPayload)
    }

    async getCartById(param){
        let result = await this.dao.getCartById(param);
        return result
    }

    async getCartByIdLean(param){
        let result = await this.dao.getCartByIdLean(param);
        return result
    }

    async getCartByIdUser(param){
        let result = await this.dao.getCartByIdUser(param);
        return result
    }

    async getCartByIdPopulate(param){
        let result = await this.dao.getCartByIdPopulate(param);
        return result
    }

    async updateCart(id,user){
        delete user._id
        let result = await this.dao.updateOne({_id:id},{$set:user})
        return result
    }

    async updateCartById(id, products){
        let result = await this.dao.updateCartById(id,products)
        return result
    }

    async deleteProductInCartById(cid, pid){
        let result = await this.dao.deleteProductInCartById(cid,pid)
        return result
    }

}