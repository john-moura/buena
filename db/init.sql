CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Types
CREATE TYPE "public"."units_type_enum" AS ENUM('Apartment', 'Office', 'Garden', 'Parking');
CREATE TYPE "public"."properties_managementtype_enum" AS ENUM('WEG', 'MV');

-- 2. Create Managers & Accountants
CREATE TABLE "managers" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "email" character varying,
    CONSTRAINT "PK_managers" PRIMARY KEY ("id")
);

CREATE TABLE "accountants" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "email" character varying,
    CONSTRAINT "PK_accountants" PRIMARY KEY ("id")
);

-- 3. Create Properties
CREATE TABLE "properties" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "managementType" "public"."properties_managementtype_enum" NOT NULL DEFAULT 'WEG',
    "managerId" uuid,
    "accountantId" uuid,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_properties" PRIMARY KEY ("id"),
    CONSTRAINT "FK_manager" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE SET NULL,
    CONSTRAINT "FK_accountant" FOREIGN KEY ("accountantId") REFERENCES "accountants"("id") ON DELETE SET NULL
);

-- 4. Create Buildings
CREATE TABLE "buildings" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "propertyId" uuid NOT NULL,
    "name" character varying,
    "street" character varying NOT NULL,
    "houseNumber" character varying NOT NULL,
    "postcode" character varying,
    "additionalInfo" character varying,
    CONSTRAINT "PK_buildings" PRIMARY KEY ("id"),
    CONSTRAINT "FK_property" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
);

-- 5. Create Units
CREATE TABLE "units" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "buildingId" uuid NOT NULL,
    "unitNumber" character varying NOT NULL,
    "type" "public"."units_type_enum" NOT NULL DEFAULT 'Apartment',
    "floor" character varying,
    "entrance" character varying,
    "sizeSqM" numeric(10,2),
    "coOwnershipShare" numeric(10,5),
    "constructionYear" integer,
    "rooms" numeric(5,1),
    CONSTRAINT "PK_units" PRIMARY KEY ("id"),
    CONSTRAINT "FK_building" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE
);
