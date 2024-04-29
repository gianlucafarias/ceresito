import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Contact } from './Contact';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ref!: string;

  @Column()
  keyword!: string;

  @Column()
  answer!: string;

  @Column({ name: 'refserialize' })
  refSerialize!: string;

  @Column()
  phone!: string;

  @Column({ type: 'jsonb' })
  options!: Record<string, any>;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_in', type: 'timestamp', nullable: true })
  updatedIn!: Date;

  @ManyToOne(() => Contact, contact => contact.history)
  contact!: Contact;
}