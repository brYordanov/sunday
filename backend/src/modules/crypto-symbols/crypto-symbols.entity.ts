import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'crypto-symbol' })
export class CryptoSymbol {
  @PrimaryColumn()
  id: string;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('double precision')
  circulating_supply: number;

  @Column('double precision')
  total_supply: number;

  @Column('double precision', { nullable: true })
  max_supply: number;

  @Column('double precision')
  ath: number;

  @Column('double precision')
  ath_change_percentage: number;

  @Column()
  ath_date: string;

  @Column('double precision')
  atl: number;

  @Column('double precision')
  atl_change_percentage: number;

  @Column()
  last_updated: string;
}
