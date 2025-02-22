import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cache')
export class Cache {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  @CreateDateColumn()
  createdAt: Date;
}
