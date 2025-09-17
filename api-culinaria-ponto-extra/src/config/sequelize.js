import { Sequelize } from "sequelize";

export const conn = new Sequelize("receitas_3D", "root", "Sen@iDev77!.", {
    host: 'localhost',
    dialect: "mysql",
    port: 3306
})