import express from 'express'
import cors from 'cors'
import { conn } from './config/sequelize.js'
import dotenv from "dotenv";

dotenv.config();


const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json())

//tabelas
import chefsModel from './models/chefsModel.js';
import receitasModel from './models/receitasModels.js';
import usuarioModel from './models/usuarioModel.js';
import favoritaModel from './models/favoritaModel.js';
import curtidaModel from './models/curtidaModel.js';
import comentarioModel from './models/comentarioModel.js';

//routes
import chefRoutes from './routes/chefRoutes.js';
import receitasRoutes from './routes/receitasRouter.js'
import usuariosRoutes from './routes/usuarioRoutes.js'
import authRoutes from './routes/authRoutes.js'
import favoritasRoutes from './routes/favoritasRoutes.js'
import curtidasRoutes from './routes/curtidasRoutes.js'



conn
    .sync()
    .then(() => {
        console.log('Banco de dados conectado ✅');
    })
    .catch((error) => console.log(error));

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "ola mundo" });
});

//Rotas principais
app.use('/api/chefs', chefRoutes);
app.use('/api/receitas', receitasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favoritas", favoritasRoutes);
app.use("/api/curtidas", curtidasRoutes);

export default app;