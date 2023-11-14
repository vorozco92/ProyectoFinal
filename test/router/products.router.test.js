import {requeter,expect} from "../supertest.test.js";
import Assert from 'assert'; 

describe('Products router testing',()=> {

    beforeEach(function(){
       
    });

    it ('[POST] /api/products - create product', async()=>{
      
        const mockProduct ={
            "title": "Pollo",
            "description": "pierna y muslo",
            "code": "P004",
            "price": "50",
            "stock": 90,
            "category": "Congelados"           
        }   
        const result = await requeter.post('/api/products').send(mockProduct)
        expect(result.statusCode).to.be.eql(200)
    }).timeout(10000);

    it ('[GET] /api/products - get all products', async()=>{
         
        const result = await requeter.get('/api/products')
        expect(result.statusCode).to.be.eql(401)

       
    }).timeout(10000);

})
