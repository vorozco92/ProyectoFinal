import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartSchema = mongoose.Schema({

    products: {
        type:[ {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'products'
            },
            qty : {type : Number , required: true, default:1 }
        }],
        default:[]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    }    
})

const cartsModel =  mongoose.model(cartsCollection, cartSchema)
export default cartsModel;