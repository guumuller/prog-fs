import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Pedido } from "./Pedido";
import { Produto } from "./Produto";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    email?: string;
    @Column()
    senha?: string;
    @Column({ nullable: true })
    nome?: string;
    @Column({ nullable: true })
    telefone?: string;
    @Column({ default: 'usuario' })
    tipo?: string; // 'admin' ou 'usuario'
    
    @OneToMany(() => Pedido, (pedido) => pedido.usuario)
    pedidos?: Pedido[];
    
    @OneToMany(() => Produto, (produto) => produto.usuario)
    produtos?: Produto[];
}