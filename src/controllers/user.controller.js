import UserDaoMongo from '../daoMongo/userDaoMongo.js';
import CartManager from '../managers/CartManager.js';

const userDao = new UserDaoMongo();
const cartManager = new CartManager();

export const createUserWithCart = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const cart = await cartManager.createCart();
        const newUser = await userDao.createUser({
            first_name,
            last_name,
            email,
            age,
            password,
            cart: cart._id
        });
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const addProductToUserCart = async (req, res) => {
    try {
        const { id, pid } = req.params;
        const { quantity } = req.body;
        const user = await userDao.getUserById(id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const updatedCart = await cartManager.addProductToCart(user.cart, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userDao.getAllUsers();
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await userDao.getUserById(req.params.id);
        if (!user) return res.status(404).send('Usuario no encontrado');
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const updatedUser = await userDao.updateUser(req.params.id, { first_name, last_name, email, age, password, role });
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const result = await userDao.deleteUser(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
