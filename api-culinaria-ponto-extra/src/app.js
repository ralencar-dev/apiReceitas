import express from 'express'
import cors from 'cors'
import { conn } from './config/sequelize.js'

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

//routes
import chefRoutes from './routes/chefRoutes.js';
import receitasRoutes from './routes/receitasRouter.js'



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
app.use('/chefs', chefRoutes);
app.use('/receitas', receitasRoutes);


export default app;