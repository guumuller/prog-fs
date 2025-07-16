import { ProdutoAdapter } from "../adapter/ProdutoAdapter";
import { ProdutoService } from "../service/ProdutoService";
import { DataSourceSingleton } from "../database";
import { Produto } from "../model/Produto";

export class ProdutoFacade {
    private service: ProdutoService;

    constructor() {
        const repository = DataSourceSingleton.getInstance().getRepository(Produto);
        this.service = new ProdutoService(repository);
    }

    async criarProduto(dto: any) {
        const produto = ProdutoAdapter.toEntity(dto);
        return await this.service.inserir(produto);
    }

    async listarProdutos() {
        return await this.service.listar();
    }
}