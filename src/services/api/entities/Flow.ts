import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('visitas_flujo')
export class Flow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre_flujo!: string;

  @Column()
  contador!: number;
}