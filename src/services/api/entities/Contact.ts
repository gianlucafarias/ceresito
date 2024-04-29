import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { History } from './History';

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phone!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_in', type: 'timestamp', nullable: true })
  updatedIn!: Date;

  @Column({ name: 'last_interaction', type: 'timestamp', nullable: true })
  lastInteraction!: Date;

  @Column({ type: 'jsonb' })
  values!: Record<string, any>;

  @OneToMany(() => History, history => history.contact)
  history!: History[];
}