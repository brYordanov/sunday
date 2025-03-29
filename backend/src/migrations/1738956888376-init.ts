import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1738956888376 implements MigrationInterface {
    name = 'Init1738956888376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stocks" ("id" SERIAL NOT NULL, "symbol" character varying NOT NULL, "oldestRecordDate" text NOT NULL, "newestRecordDate" text NOT NULL, "termAnalysis" jsonb NOT NULL, "predictability" jsonb NOT NULL, CONSTRAINT "UQ_abdd997b009437486baf7531854" UNIQUE ("symbol"), CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stocks"`);
    }

}
