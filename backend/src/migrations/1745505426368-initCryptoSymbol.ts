import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCryptoSymbol1745505426368 implements MigrationInterface {
    name = 'InitCryptoSymbol1745505426368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "crypto-symbol" ("id" character varying NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "circulating_supply" integer NOT NULL, "total_supply" integer NOT NULL, "max_supply" integer NOT NULL, "ath" integer NOT NULL, "ath_change_percentage" integer NOT NULL, "ath_date" character varying NOT NULL, "atl" integer NOT NULL, "atl_change_percentage" integer NOT NULL, "last_updated" character varying NOT NULL, CONSTRAINT "PK_69d5383097114960195ded4e014" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "crypto-symbol"`);
    }

}
