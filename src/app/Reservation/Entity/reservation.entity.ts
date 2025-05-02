import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from '../../room/Entity/room.entity';
import { User } from 'src/User/Entity/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => Room, room => room.id, { eager: true, onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User, user => user.id, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
