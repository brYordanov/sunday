import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFloatToDoublePrecisionCryptoSymbol1745507248384 implements MigrationInterface {
    name = 'ChangeFloatToDoublePrecisionCryptoSymbol1745507248384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "circulating_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "circulating_supply" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" DROP COLUMN "circulating_supply"`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ADD "circulating_supply" integer NOT NULL`);
    }

}
