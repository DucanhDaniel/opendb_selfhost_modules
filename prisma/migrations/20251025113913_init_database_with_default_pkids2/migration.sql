-- AlterTable
ALTER TABLE "FAD_AccountDailyReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_AdCreativeReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_AdDailyReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_AdPerformanceReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_AdSetDailyReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_AdSetPerformanceReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_BmAndAdAccounts" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignDailyReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignOverviewReport" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByAge" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByGender" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByPlatform" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FAD_CampaignPerformanceByRegion" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FBT_FbBillingData" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcHienThiTiepCanTrang" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatBaiVietLifetime" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatBaiVietTongHop" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatVideoTongHop" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcHieuSuatVideoTungVideo" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcPhanTichCamXucBaiViet" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcPhanTichFanTheoViTri" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcPhanTichNguonLuotThichMoi" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcTongHopHieuSuatTrangNangCao" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MPI_BcTuongTacTangTruongCongDong" ALTER COLUMN "pkId" SET DEFAULT gen_random_uuid();
