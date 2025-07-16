import { DataSourceSingleton } from "../src/database";

describe("DataSourceSingleton", () => {
    it("retorna a mesma instância entre chamadas", () => {
        const instance1 = DataSourceSingleton.getInstance();
        const instance2 = DataSourceSingleton.getInstance();
        expect(instance1).toBe(instance2);
    });

    it("deve ter configuração correta", () => {
        const instance = DataSourceSingleton.getInstance();
        expect(instance.options.type).toBe("postgres");
        expect(instance.options.database).toBe(process.env.DB_NAME || "trab_padroes");
    });
});
