import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture?: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  boughtAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deceasedAt?: Date;
}
