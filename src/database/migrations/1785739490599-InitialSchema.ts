import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785739490599 implements MigrationInterface {
    name = 'InitialSchema1785739490599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" SERIAL NOT NULL, "code" character varying(3) NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "UQ_723472e41cae44beb0763f4039c" UNIQUE ("code"), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "currencyCode" character varying(3), "onboardingStep" integer NOT NULL DEFAULT '0', "isOnboardingCompleted" boolean NOT NULL DEFAULT false, "authInfoEmail" character varying(255) NOT NULL, "authInfoPassword" character varying(255) NOT NULL, "basicInfoFirstname" character varying, "basicInfoLastname" character varying, "basicInfoCurrentbalance" numeric(15,2), "tokenInfoRefreshtoken" character varying, "tokenInfoRefreshtokenexpiresat" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_a28ca0e399c489ecf1b97c4d8c8" UNIQUE ("authInfoEmail"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_136d2d870e4b1c34556c1e1194" ON "users" ("currencyCode") `);
        await queryRunner.query(`CREATE TYPE "public"."categories_categorytype_enum" AS ENUM('expense', 'income')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "value" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT true, "categoryType" "public"."categories_categorytype_enum" NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_557b1d2ba5e445c3a4e234f5dc9" UNIQUE ("title", "userId"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e94de3e9d6fef13db56051af87" ON "categories" ("userId", "categoryType") `);
        await queryRunner.query(`CREATE INDEX "IDX_13e8b2a21988bec6fdcbb1fa74" ON "categories" ("userId") `);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "otp" character varying(4) NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_9bd09e59708ea02bb49081961c5" UNIQUE ("email"), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_136d2d870e4b1c34556c1e1194c" FOREIGN KEY ("currencyCode") REFERENCES "currency"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_136d2d870e4b1c34556c1e1194c"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13e8b2a21988bec6fdcbb1fa74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e94de3e9d6fef13db56051af87"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_categorytype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_136d2d870e4b1c34556c1e1194"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
