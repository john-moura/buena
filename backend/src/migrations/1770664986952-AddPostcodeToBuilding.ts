import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostcodeToBuilding1770664986952 implements MigrationInterface {
    name = 'AddPostcodeToBuilding1770664986952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buildings" ADD "postcode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buildings" DROP COLUMN "postcode"`);
    }

}
