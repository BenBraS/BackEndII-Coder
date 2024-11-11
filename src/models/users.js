import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] 
    },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Método para comparar la contraseña
userSchema.methods.isValidPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;
