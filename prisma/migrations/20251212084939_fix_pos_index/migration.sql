-- DropIndex
DROP INDEX "public"."POS_BasicReport_order_id_idx";

-- CreateIndex
CREATE INDEX "POS_BasicReport_order_id_item_id_idx" ON "POS_BasicReport"("order_id", "item_id");
