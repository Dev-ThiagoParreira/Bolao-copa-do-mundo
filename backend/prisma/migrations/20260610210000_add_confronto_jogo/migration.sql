-- CreateEnum
CREATE TYPE "TipoResultadoJogo" AS ENUM ('VITORIA_TIME_A', 'EMPATE', 'VITORIA_TIME_B');

-- AlterTable
ALTER TABLE "campanha" ADD COLUMN "time_a" TEXT,
ADD COLUMN "time_b" TEXT;

-- AlterTable
ALTER TABLE "campanha_opcoes" ADD COLUMN "tipo_resultado" "TipoResultadoJogo";
