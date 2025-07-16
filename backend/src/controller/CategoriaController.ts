import { Request, Response } from 'express';
import { CategoriaService } from '../service/CategoriaService';

export class CategoriaController {
  private service: CategoriaService;

  constructor(service: CategoriaService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { nome } = req.body;
    try { 
        const novaCategoria = await this.service.inserir({ nome });
        res.status(201).json(novaCategoria);
    }
    catch(err:any) {
        res.status(err.id || 400).json({ error: err.msg });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await this.service.listar();
        res.status(200).json(categorias);
    } catch (err: any) {
        res.status(err.id || 500).json({ error: err.msg });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const categoria = await this.service.buscarPorId(id);
        res.status(200).json(categoria);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { nome } = req.body;

    try{ 
        const categoriaAtualizada = await this.service.atualizar(id, { nome });
        res.status(200).json(categoriaAtualizada);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const categoria = await this.service.deletar(id);
        res.status(200).json(categoria);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };
} 