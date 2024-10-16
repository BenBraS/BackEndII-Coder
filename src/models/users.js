import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' }, // referencia al carrito
    role: { type: String, default: 'user' }
});

// Middleware para encriptar la contraseña antes de guardar el usuarioAQUI SE ENCRIPTA
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hashSync(this.password, 10); // encripta la contraseña con un salt de 10
    }
    next();
});

// Método para comparar la contraseña
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);


export default User;
