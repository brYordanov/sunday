import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNumberToFloatCryptoSymbol1745507096064 implements MigrationInterface {
    name = 'ChangeNumberToFloatCryptoSymbol1745507096064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "total_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "total_supply" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "max_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "max_supply" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "ath"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "ath" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "ath_change_percentage"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "ath_change_percentage" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "atl"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "atl" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "atl_change_percentage"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "atl_change_percentage" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "atl_change_percentage"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "atl_change_percentage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "atl"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "atl" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "ath_change_percentage"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "ath_change_percentage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "ath"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "ath" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "max_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "max_supply" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "total_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "total_supply" integer NOT NULL`);
    }

}
