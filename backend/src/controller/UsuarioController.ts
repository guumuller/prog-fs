import { Request, Response } from 'express';
import { UsuarioService } from '../service/UsuarioService';

export class UsuarioController {
  private service: UsuarioService;

  constructor(service: UsuarioService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { email, senha, nome, telefone, tipo } = req.body;
    try{ 
        const novoUsuario = await this.service.inserir({ email, senha, nome, telefone, tipo });
        res.status(201).json(novoUsuario);
    }
    catch(err:any) {
        res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.service.listar();
      res.status(200).json(usuarios);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.service.buscarPorId(id);
      res.status(200).json(usuario);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { email, senha, nome, telefone, tipo } = req.body;
      
      const usuarioAtualizado = await this.service.atualizar(id, { 
        email, senha, nome, telefone, tipo 
      });
      res.status(200).json(usuarioAtualizado);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await this.service.deletar(id);
      res.status(200).json(usuario);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
    }
  };
}
