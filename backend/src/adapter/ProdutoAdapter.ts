import { Produto } from "../model/Produto";

export class ProdutoAdapter {
    static toEntity(dto: any): Produto {
        const produto = new Produto();
        produto.nome = dto.nome;
        produto.categoria = dto.categoria;
        produto.preco = dto.preco;
        return produto;
    }
}
