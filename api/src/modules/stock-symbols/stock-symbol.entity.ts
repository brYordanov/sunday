import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'stock-symbol' })
export class StockSymbol {
  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  exchangeName: string | null;

  @Column({ nullable: true })
  exchangeShortName: string | null;

  @Column()
  type: string;
}
