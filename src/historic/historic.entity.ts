import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Historic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  username: string;

  @Column()
  status: boolean;

  @Column({ default: 0 })
  repositories: number;
}