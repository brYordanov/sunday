import { MigrationInterface, QueryRunner } from "typeorm";

export class InitStockSymbols1741032875503 implements MigrationInterface {
    name = 'InitStockSymbols1741032875503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock-symbol" ("symbol" character varying NOT NULL, "name" character varying NOT NULL, "exchangeName" character varying NOT NULL, "exchangeShortName" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_f6680a356b9c12f81a7654dca87" PRIMARY KEY ("symbol"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stock-symbol"`);
    }

}
