import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Usuario } from "./Usuario";
import { Produto } from "./Produto";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    usuario?: Usuario;
    
    @ManyToMany(() => Produto)
    @JoinTable({
        name: "pedido_produtos",
        joinColumn: {
            name: "pedido_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "produto_id",
            referencedColumnName: "id"
        }
    })
    produtos?: Produto[];
    
    @Column("decimal")
    valorTotal?: number;
    
    @Column({ default: 'pendente' })
    status?: string; // 'pendente', 'aprovado', 'cancelado', 'entregue'
    
    @CreateDateColumn()
    dataCriacao?: Date;
    
    @Column({ type: 'text', nullable: true })
    observacoes?: string;
} 