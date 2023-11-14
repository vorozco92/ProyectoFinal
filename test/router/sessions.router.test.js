import {requeter,expect} from "../supertest.test.js";
import CONFIG from '../config/config.js'

describe('Session router testing',()=> {
    let cookie
    it ('[POST] /api/sessions/register - Register user', async()=>{
        
        const mockUser ={
            first_name: 'Juan',
            last_name: 'Torres',
            email:'jtorres@gmail.com' ,
            password:'1234' 
        }        
        const result = await requeter.post('/api/sessions/register').send(mockUser)
        expect(result.statusCode).to.be.eql(200)
        expect(result.body._id).to.be.ok
    })

    it ('[POST] /api/sessions/login- Login user', async()=>{
        const mockCredential ={
            email:'jtorres@gmail.com' ,
            password:'1234' 
        }        
        const result = await requeter.post('/api/sessions/login').send(mockCredential)
        expect(result.statusCode).to.be.eql(200)
        expect(result.headers).to.have.property('set-cookie')
        const cookieHeader =result.headers['set-cookie'][0]
        expect(cookieHeader).to.be.ok
       
        const cookiePart = cookieHeader.split('=');
        cookie={
            name: cookiePart[0],
            value: cookiePart[1]
        }
        expect(cookie.name).to.be.eql(CONFIG.SECRET_SESSION)
        expect(cookie.value).to.be.ok
    })

})

