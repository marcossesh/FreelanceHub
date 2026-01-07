-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "document" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;
