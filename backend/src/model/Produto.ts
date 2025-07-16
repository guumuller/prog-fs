import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "./Categoria";
import { Usuario } from "./Usuario";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {eager: true})
    categoria?: Categoria;
    @Column("decimal")
    preco?: number;
    @Column({ nullable: true })
    imagemUrl?: string;
    @Column({ type: 'text', nullable: true })
    descricao?: string;
    @ManyToOne(() => Usuario, (usuario) => usuario.produtos, {eager: true})
    usuario?: Usuario;
}