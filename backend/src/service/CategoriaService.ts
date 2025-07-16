import { Repository } from 'typeorm';
import { Categoria } from '../model/Categoria';

export class CategoriaService {
  private repository: Repository<Categoria>;

  constructor(repository: Repository<Categoria>) {
    this.repository = repository;
  }

  async listar(): Promise<Categoria[]> {
    return await this.repository.find();
  }

  async buscarPorId(id: number): Promise<Categoria> {
    const categoria = await this.repository.findOneBy({ id });
    if (!categoria) {
      throw { id: 404, msg: 'Categoria não encontrada' };
    }
    return categoria;
  }

  async inserir(categoria: Categoria): Promise<Categoria> {
    if (!categoria.nome || categoria.nome.trim() === '') {
      throw { id: 400, msg: 'Nome da categoria é obrigatório' };
    }
    return await this.repository.save(categoria);
  }

  async atualizar(id: number, categoria: Categoria): Promise<Categoria> {
    const categoriaExistente = await this.repository.findOneBy({ id });
    if (!categoriaExistente) {
      throw { id: 404, msg: 'Categoria não encontrada' };
    }

    if (!categoria.nome || categoria.nome.trim() === '') {
      throw { id: 400, msg: 'Nome da categoria é obrigatório' };
    }

    categoriaExistente.nome = categoria.nome;
    return await this.repository.save(categoriaExistente);
  }

  async deletar(id: number): Promise<Categoria> {
    const categoria = await this.repository.findOneBy({ id });
    if (!categoria) {
      throw { id: 404, msg: 'Categoria não encontrada' };
    }
    return await this.repository.remove(categoria);
  }
} 