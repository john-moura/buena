import { MigrationInterface, QueryRunner } from "typeorm";

export class NormalizeContacts1770664822457 implements MigrationInterface {
    name = 'NormalizeContacts1770664822457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accountants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, CONSTRAINT "PK_af6522c71f065a4b80e5d9f7574" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "managerName"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "accountantName"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "managerId" uuid`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "accountantId" uuid`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_fbaf53f64c0da753b0510ebcaf0" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_0c9f94887c29553ce65a76001f9" FOREIGN KEY ("accountantId") REFERENCES "accountants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_0c9f94887c29553ce65a76001f9"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_fbaf53f64c0da753b0510ebcaf0"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "accountantId"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "accountantName" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "managerName" character varying`);
        await queryRunner.query(`DROP TABLE "accountants"`);
        await queryRunner.query(`DROP TABLE "managers"`);
    }

}
