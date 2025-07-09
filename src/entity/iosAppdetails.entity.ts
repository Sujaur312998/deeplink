import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ios_app_details')
export class IOSAppDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appName: string;

  @Column()
  appPath: string;
  
  @Column()
  fallback: string;
}