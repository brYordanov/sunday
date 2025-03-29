import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCache1739560312705 implements MigrationInterface {
    name = 'InitCache1739560312705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cache" ("key" character varying NOT NULL, "value" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56570efc222b6e6be947abfc801" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cache"`);
    }

}
