import { Request, Response } from "express";
import { LoginService } from "../service/LoginService";

export class LoginController {
    private service: LoginService;
  
    constructor(service: LoginService) {
      this.service = service;
    }
  
    realizarLogin = async (req: Request, res: Response): Promise<void> => {
      const { email, senha } = req.body;
      try { 
          const token = await this.service.verificarLogin(email, senha);
          // Busque o usuário no banco
          const usuario = await this.service.buscarUsuarioPorEmail(email);
          if (usuario) {
              delete usuario.senha;
          }
          res.status(201).json({ token, usuario });
      }
      catch(err:any) {
          res.status(err.id).json({ error: err.msg });
      }
    }
}