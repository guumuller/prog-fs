import { Repository } from "typeorm";
import { Usuario } from "../model/Usuario";
import { sign, verify } from "jsonwebtoken"

const SECRET = "Sen@c2025";
export class LoginService {
    private repository: Repository<Usuario>;

    constructor(repository: Repository<Usuario>) {
        this.repository = repository;
    }

    public async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ email });
    }
    
    async verificarLogin(email: string, senha: string): Promise<String> {
        let usuario = await this.repository.findOneBy({email: email});
        if(usuario && usuario.senha == senha){            
            let token = sign({
                id: usuario.id,
                email: usuario.email
            }, SECRET,
                { expiresIn: '1h' }
            );
            return token;            
        }
        throw ({id: 401, msg: "Usuario ou senha invalidos"});    
    }  
    
    async validarToken(token: string): Promise<any> {
        try{
            console.log("Token ", token);
            const payload = verify(token, SECRET);

            if(!payload){
                throw ({id: 401, msg: "Token Invalido"});    
            }
            return payload;
        } catch (err) {
            console.log(err)
            throw ({id: 401, msg: "Token Invalido"});    
        }
    }
}
