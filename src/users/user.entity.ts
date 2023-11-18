import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userTag: string;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: 0 })
  following: number;

  @Column({ default: 0 })
  repositories: number;

  @Column({ nullable: true })
  biography: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  avatar_url: string;
}