/*
  Warnings:

  - A unique constraint covering the columns `[invoiceSequence]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceSequence" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "shareTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceSequence_key" ON "Invoice"("invoiceSequence");
