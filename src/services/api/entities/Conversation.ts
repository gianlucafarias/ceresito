import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conversaciones')
export class Converstation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  fecha_hora!: Date;

  @Column()
  nombre!: string;

  @Column()
  telefono!: string;

  @Column()
  duracion_minutos!: string;
}