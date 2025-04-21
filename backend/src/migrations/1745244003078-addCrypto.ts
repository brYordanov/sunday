import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrypto1745244003078 implements MigrationInterface {
    name = 'AddCrypto1745244003078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "crypto" ("id" SERIAL NOT NULL, "symbol" character varying NOT NULL, "oldestRecordDate" text NOT NULL, "newestRecordDate" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a797161c3159731f40f544a6c83" UNIQUE ("symbol"), CONSTRAINT "PK_5084b15a218a51654c1db780d8b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "crypto"`);
    }

}
