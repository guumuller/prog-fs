import { DataSource } from "typeorm";
import { Categoria } from "./model/Categoria";
import { Produto } from "./model/Produto";
import { Usuario } from "./model/Usuario";
import { Pedido } from "./model/Pedido";

export class DataSourceSingleton {
    private static instance: DataSource;

    private constructor() {}

    static getInstance(): DataSource {

        if (!DataSourceSingleton.instance) {
            DataSourceSingleton.instance = new DataSource({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "123456",
                database: "trab_padroes",
                synchronize: true,
                logging: true,
                entities: [Categoria, Produto, Usuario, Pedido],
                subscribers: [],
                migrations: [],
            });
        }

    return DataSourceSingleton.instance;
    }
}