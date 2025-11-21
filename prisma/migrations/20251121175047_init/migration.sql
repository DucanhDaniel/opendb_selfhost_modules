/*
  Warnings:

  - Added the required column `user_id` to the `BCA_BCAccountInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `BCA_BCAssetInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `BCA_BCInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AccountDailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AdCreativeReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AdDailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AdPerformanceReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AdSetDailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_AdSetPerformanceReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_BmAndAdAccounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignDailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignOverviewReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignPerformanceByAge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignPerformanceByGender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignPerformanceByPlatform` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FAD_CampaignPerformanceByRegion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FBT_FbBillingData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GMV_CampaignPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GMV_CreativeDetailReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GMV_ProductDetailReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcHienThiTiepCanTrang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcHieuSuatBaiVietLifetime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcHieuSuatBaiVietTongHop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcHieuSuatVideoTongHop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcHieuSuatVideoTungVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcPhanTichCamXucBaiViet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcPhanTichFanTheoViTri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcPhanTichNguonLuotThichMoi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcTongHopHieuSuatTrangNangCao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `MPI_BcTuongTacTangTruongCongDong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AdGroupPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AdPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AudienceAgeGenderReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AudienceAgeReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AudienceCountryReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AudienceGenderReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_AudienceRegionReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_CampaignPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_CreativePerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_PlacementReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TTA_PlatformReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BCA_BCAccountInfo" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BCA_BCAssetInfo" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BCA_BCInfo" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AccountDailyReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AdCreativeReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AdDailyReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AdPerformanceReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AdSetDailyReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_AdSetPerformanceReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_BmAndAdAccounts" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignDailyReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignOverviewReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByAge" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByGender" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByPlatform" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByRegion" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FBT_FbBillingData" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GMV_CampaignPerformance" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GMV_CreativeDetailReport" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GMV_ProductDetailReport" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "product_status" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcHienThiTiepCanTrang" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatBaiVietLifetime" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatBaiVietTongHop" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatVideoTongHop" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatVideoTungVideo" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcPhanTichCamXucBaiViet" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcPhanTichFanTheoViTri" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcPhanTichNguonLuotThichMoi" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcTongHopHieuSuatTrangNangCao" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MPI_BcTuongTacTangTruongCongDong" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AdGroupPerformance" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AdPerformance" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AudienceAgeGenderReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AudienceAgeReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AudienceCountryReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AudienceGenderReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_AudienceRegionReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_CampaignPerformance" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_CreativePerformance" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_PlacementReport" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TTA_PlatformReport" ADD COLUMN     "user_id" TEXT NOT NULL;
