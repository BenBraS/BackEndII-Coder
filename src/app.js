import express from 'express';
import __dirname from './utils.js';
import expressConfig from './config/expressConfig.js';
import socketConfig from './config/socketConfig.js';

//Configuración Server
const PORT = 9090;
const app = express();

//Iniciar Servidor Express
const httpServer = app.listen(PORT, () =>
    console.log(`Servidor escuchando por el puerto: ${PORT}`));

// Configuración de Express
expressConfig(app, __dirname);

// Configuración de servidor WebSocket Socket.io
socketConfig(httpServer);

export default app;
