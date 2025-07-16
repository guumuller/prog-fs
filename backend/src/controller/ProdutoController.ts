import { Request, Response } from 'express';
import { ProdutoService } from '../service/ProdutoService';
import { LoginService } from '../service/LoginService';

export class ProdutoController {
  private service: ProdutoService;
  private loginService: LoginService;

  constructor(service: ProdutoService, loginService: LoginService) {
    this.service = service;
    this.loginService = loginService;
  }

  private async getUsuarioIdFromToken(req: Request): Promise<number> {
    const token = req.get("Token") || req.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw { id: 401, msg: "Token não fornecido" };
    }
    
    const decoded = await this.loginService.validarToken(token);
    return decoded.id;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { nome, categoria, preco, imagemUrl, descricao } = req.body;
    try { 
        const usuarioId = await this.getUsuarioIdFromToken(req);
        const newProduct = await this.service.inserir({ nome, categoria, preco, imagemUrl, descricao }, usuarioId);
        res.status(201).json(newProduct);
    }
    catch(err:any) {
      res.status(err.id || 400).json({ message: 'Erro ao inserir produto', error: err.msg });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.service.listar();
    res.json(products);
  };

  listarPorUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = await this.getUsuarioIdFromToken(req);
      const products = await this.service.listarPorUsuario(usuarioId);
      res.json(products);
    } catch (err: any) {
      res.status(err.id || 400).json({ message: 'Erro ao listar produtos do usuário', error: err.msg });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const produto = await this.service.buscarPorId(id);
        res.json(produto);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { nome, categoria, preco, imagemUrl, descricao } = req.body;

    try{ 
        const usuarioId = await this.getUsuarioIdFromToken(req);
        const produtoAtualizado = await this.service.atualizar(id, { nome, categoria, preco, imagemUrl, descricao }, usuarioId);
        res.json(produtoAtualizado);
    } catch (err: any) {
        res.status(err.id || 400).json({ error: err.msg });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const usuarioId = await this.getUsuarioIdFromToken(req);
        const produto = await this.service.deletar(id, usuarioId);
        res.json(produto);
    } catch (err: any) {
        res.status(err.id || 400).json({ error: err.msg });
    }
  };
}