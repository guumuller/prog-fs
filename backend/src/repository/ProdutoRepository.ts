import { Produto } from '../model/Produto';

export class ProdutoRepository {
  private listaProdutos: Produto[] = [];
  private proximoId: number = 1;

  inserir(produto: Omit<Produto, 'id'>): Produto {
    const novoProduto = new Produto(
      this.proximoId++,
      produto.nome,
      produto.categoria,
      produto.preco
    );
    this.listaProdutos.push(novoProduto);
    return novoProduto;
  }

  listar(): Produto[] {
    return [...this.listaProdutos]; //clone da lista
  }

  buscarPorId(id: number): Produto | undefined {
    return this.listaProdutos.find(p => p.id === id);
  }

  atualizar(id: number, produto: Omit<Produto, 'id'>): Produto | undefined {
    const index = this.listaProdutos.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const produtoAtualizado = new Produto(
      id,
      produto.nome,
      produto.categoria,
      produto.preco
    );
    this.listaProdutos[index] = produtoAtualizado;
    return produtoAtualizado;
  }

  deletar(id: number): Produto | undefined {
    const index = this.listaProdutos.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    return this.listaProdutos.splice(index, 1).at(0);
  }
}