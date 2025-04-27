import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMaxSuppluToNullableCryptoSymbol1745507426202 implements MigrationInterface {
    name = 'ChangeMaxSuppluToNullableCryptoSymbol1745507426202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ALTER COLUMN "max_supply" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ALTER COLUMN "max_supply" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ALTER COLUMN "max_supply" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto-symbol" ALTER COLUMN "max_supply" SET NOT NULL`);
    }

}
