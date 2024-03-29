import mongoose from "mongoose";

const ticketsCollection = 'tickets'
const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        required : true
    },    
    purchase_datetime:{
        type: String,
        default: null
    },
    amount:{
        type: Number,
        required : true
    },
    purchaser:{
        type: String,
        required : true
    },
})

const ticketsModel =  mongoose.model(ticketsCollection, ticketSchema)
export default ticketsModel;