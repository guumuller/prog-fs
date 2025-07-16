import { NextFunction, Request, Response } from "express";
import { LoginService } from "../service/LoginService";

export class TokenMiddleware {
    private service: LoginService;

    constructor(service: LoginService) {
        this.service = service;
    }

    async verificarAcesso(req: Request, res: Response, next: NextFunction) {
        let token = req.get("Token");
        
        // Se não encontrar no header Token, tenta no Authorization
        if (!token) {
            const authHeader = req.get("Authorization");
            if (authHeader) {
                const [, authToken] = authHeader.split(" ");
                token = authToken;
            }
        }
        
        if (!token) {
            return res.status(401).json({ error: "Nenhum token informado!" });
        }

        try {
            await this.service.validarToken(token);
            console.log("Token validado!");
            next();
        } catch (err: any) {
            console.log(err);
            return res.status(err.id || 401).json({ error: err.msg || "Token inválido" });
        }
    }
}