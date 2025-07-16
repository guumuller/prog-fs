import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @OneToMany(() =>Produto, (produto) => produto.categoria )
    produtos?: Produto[];
}    