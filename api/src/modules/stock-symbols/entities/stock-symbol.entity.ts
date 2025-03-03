import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({name: 'stock-symbol'})
export class StockSymbol {
    @PrimaryColumn()
    symbol: string

    @Column()
    name: string

    @Column()
    exchangeName: string

    @Column()
    exchangeShortName: string

    @Column()
    type: string
}