import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AndroidAppDetails } from "./androidaAppdetails.entity";
import { IOSAppDetails } from "./iosAppdetails.entity";
import { DefaultDetails } from "./default.entity";

@Entity('tergets')
export class Tergets {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AndroidAppDetails, { cascade: true, eager: true })
  @JoinColumn()
  android: AndroidAppDetails;

  @OneToOne(() => IOSAppDetails, { cascade: true, eager: true })
  @JoinColumn()
  ios: IOSAppDetails;

  @OneToOne(() => DefaultDetails, { cascade: true, eager: true })
  @JoinColumn()
  default: DefaultDetails;
}