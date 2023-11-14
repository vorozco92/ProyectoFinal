import {requeter,expect} from "../supertest.test.js";
import Assert from 'assert'; 

describe('Carts router testing',()=> {

    beforeEach(function(){
       
    });

    it ('[GET] /api/carts - get carts', async()=>{
      
        const result = await requeter.get('/api/carts')
        expect(result.statusCode).to.be.eql(200)
        Assert.strictEqual(Array.isArray(result.body.carts),true);
    }).timeout(10000);

    it ('[GET] /api/carts/:id - get cart by id', async()=>{
        try{ 
        const result = await requeter.get('/api/carts/000002')
      
        expect(result.statusCode).to.be.eql(401)
        expect(result._id).to.be.empty
        }
        catch(error){
                console.log('error:'+error);
        }
    }).timeout(10000);

})
