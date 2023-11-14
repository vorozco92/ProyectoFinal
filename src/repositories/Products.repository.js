import getDAOS from "../dao/factory.js";
import ProductDTO from "../dto/Product.dto.js";

const { productsDAO } = getDAOS();

export class ProductsRepository{

    constructor(){
        this.dao= productsDAO;
    }

    async getAllProducts(limit, page, sort, query ){
        return await this.dao.get(limit, page, sort, query);
    }

    async saveProduct(payload){
        const productPayload =  ProductDTO.getProductInputFrom(payload)
        return await this.dao.save(productPayload)
    }

    async getProductById(param){
        let result = await this.dao.getProductById(param);
        return result
    }

    async updateProduct(id, product){
        delete product._id
        let result = await this.dao.updateOne({_id:id},{$set:product})
        return result
    }

}