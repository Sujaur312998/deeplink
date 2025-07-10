import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tergets } from "./tergets.entity";

@Entity('deeplink')
export class DeepLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({nullable: true, default:"deeplink"})
  name: string;

  @OneToOne(() => Tergets, { cascade: true, eager: true })
  @JoinColumn()
  tergets: Tergets;
}