/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `contact_methods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contact_methods_type_key" ON "contact_methods"("type");
