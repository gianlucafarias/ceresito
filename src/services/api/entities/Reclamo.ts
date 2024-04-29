import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'reclamos' })
export class Reclamo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fecha!: Date;

  @Column()
  nombre!: string;

  @Column()
  reclamo!: string;

  @Column()
  ubicacion!: string;

  @Column()
  barrio!: string;

  @Column()
  telefono!: string;

  @Column()
  estado!: string;

  @Column()
  detalle!: string;
}