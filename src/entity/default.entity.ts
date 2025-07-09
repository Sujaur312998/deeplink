import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('default_details')
export class DefaultDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fallback: string;
}