import { Repository } from 'typeorm';
import { Usuario } from '../model/Usuario';
import { ValidationStrategy } from '../strategy/ValidationStrategy';
import { UsuarioValidationStrategy } from '../strategy/UsuarioValidationStrategy';

export class UsuarioService {
  private repository: Repository<Usuario>;
  private validationStrategy: ValidationStrategy;

  constructor(repository: Repository<Usuario>) {
    this.repository = repository;
    this.validationStrategy = new UsuarioValidationStrategy();
  }

  public setValidationStrategy(strategy: ValidationStrategy): void {
    this.validationStrategy = strategy;
  }

  async inserir(usuario: Usuario): Promise<Usuario> {
    // Usando Strategy Pattern para validação
    const validation = this.validationStrategy.validate(usuario);
    if (!validation.isValid) {
      throw { id: 400, msg: `Dados inválidos: ${validation.errors.join(', ')}` };
    }
    
    return await this.repository.save(usuario);
  }

  async listar(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async buscarPorId(id: number): Promise<Usuario> {
    const usuario = await this.repository.findOneBy({ id });
    if (!usuario) {
      throw { id: 404, msg: "Usuário não encontrado" };
    }
    return usuario;
  }

  async buscarPorEmail(email: string): Promise<Usuario> {
    const usuario = await this.repository.findOneBy({ email });
    if (!usuario) {
      throw { id: 404, msg: "Usuário não encontrado" };
    }
    return usuario;
  }

  async atualizar(id: number, dadosAtualizados: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.repository.findOneBy({ id });
    if (!usuario) {
      throw { id: 404, msg: "Usuário não encontrado" };
    }

    // Validar dados atualizados
    const validation = this.validationStrategy.validate({ ...usuario, ...dadosAtualizados });
    if (!validation.isValid) {
      throw { id: 400, msg: `Dados inválidos: ${validation.errors.join(', ')}` };
    }

    Object.assign(usuario, dadosAtualizados);
    return await this.repository.save(usuario);
  }

  async deletar(id: number): Promise<Usuario> {
    const usuario = await this.repository.findOneBy({ id });
    if (!usuario) {
      throw { id: 404, msg: "Usuário não encontrado" };
    }

    await this.repository.remove(usuario);
    return usuario;
  }
}
