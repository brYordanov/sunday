import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAnalysedFieldsFromStock1745240389586 implements MigrationInterface {
  name = 'RemoveAnalysedFieldsFromStock1745240389586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stocks" DROP COLUMN "termAnalysis"`);
    await queryRunner.query(`ALTER TABLE "stocks" DROP COLUMN "predictability"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stocks" ADD "predictability" jsonb NOT NULL`);
    await queryRunner.query(`ALTER TABLE "stocks" ADD "termAnalysis" jsonb NOT NULL`);
  }
}
