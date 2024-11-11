import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: uuidv4,  // Autogenera un código único
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,  // Autogenera la fecha y hora actual
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,  // Almacena el email del comprador
    }
});


const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

