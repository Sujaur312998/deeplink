import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('android_app_details')
export class AndroidAppDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appName: string;

  @Column()
  appPackage: string;

  @Column()
  appPath: string;
  
  @Column()
  fallback: string;
}