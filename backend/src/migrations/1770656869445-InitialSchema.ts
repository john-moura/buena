import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770656869445 implements MigrationInterface {
    name = 'InitialSchema1770656869445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "public"."units_type_enum" AS ENUM('Apartment', 'Office', 'Garden', 'Parking'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "buildingId" uuid NOT NULL, "unitNumber" character varying NOT NULL, "type" "public"."units_type_enum" NOT NULL DEFAULT 'Apartment', "floor" character varying, "entrance" character varying, "sizeSqM" numeric(10,2), "coOwnershipShare" numeric(10,5), "constructionYear" integer, "rooms" numeric(5,1), CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "buildings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "propertyId" uuid NOT NULL, "street" character varying NOT NULL, "houseNumber" character varying NOT NULL, "additionalInfo" character varying, CONSTRAINT "PK_bc65c1acce268c383e41a69003a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "public"."properties_managementtype_enum" AS ENUM('WEG', 'MV'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "managementType" "public"."properties_managementtype_enum" NOT NULL DEFAULT 'WEG', "managerName" character varying, "accountantName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);

        // Add constraints only if they don't exist
        try {
            await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_3f8b928bed788bea24f7461104f" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        } catch (e) { }
        try {
            await queryRunner.query(`ALTER TABLE "buildings" ADD CONSTRAINT "FK_3e55eb402d4f9c4b76ecc0b7a3e" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        } catch (e) { }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buildings" DROP CONSTRAINT "FK_3e55eb402d4f9c4b76ecc0b7a3e"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_3f8b928bed788bea24f7461104f"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_managementtype_enum"`);
        await queryRunner.query(`DROP TABLE "buildings"`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP TYPE "public"."units_type_enum"`);
    }

}
