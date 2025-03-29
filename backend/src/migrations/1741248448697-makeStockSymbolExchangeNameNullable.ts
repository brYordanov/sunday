import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeStockSymbolExchangeNameNullable1741248448697 implements MigrationInterface {
    name = 'MakeStockSymbolExchangeNameNullable1741248448697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeShortName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeShortName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeShortName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeShortName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock-symbol" ALTER COLUMN "exchangeName" SET NOT NULL`);
    }

}
