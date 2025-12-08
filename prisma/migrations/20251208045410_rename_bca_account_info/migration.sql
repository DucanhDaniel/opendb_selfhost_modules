/*
  Warnings:

  - You are about to drop the `BCA_BCAccountInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
ALTER TABLE "public"."BCA_BCAccountInfo" RENAME TO "bca_bc_account_info";
ALTER INDEX "BCA_BCAccountInfo_pkey" RENAME TO "bca_bc_account_info_pkey";