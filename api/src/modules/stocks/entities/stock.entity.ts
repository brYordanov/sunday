import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TermAnalysis, TermPredictability } from '../stock.types';

@Entity({ name: 'stocks' })
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column({ type: 'text' })
  oldestRecordDate: string;

  @Column({ type: 'text' })
  newestRecordDate: string;

  @Column({ type: 'jsonb' })
  termAnalysis: TermAnalysis;

  @Column({ type: 'jsonb' })
  predictability: TermPredictability;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
