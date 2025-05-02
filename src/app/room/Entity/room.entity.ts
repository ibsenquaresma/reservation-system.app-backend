import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  capacity: number;

  @Column({ default: false })
  isOccupied: boolean;

  @Column("text", { array: true, nullable: true })
  features: string[];
}