export const POSCAKE_API_BASE_URL = "https://pos.pages.fm/api/v1";

export const POSCAKE_REPORT_TEMPLATES_STRUCTURE = [
  {
    groupName: "Báo cáo Đơn hàng",
    templates: [
      {
        name: "Báo cáo đơn hàng chi tiết (Full Data)",
        id: "ORDER_ITEMS_FLAT",
        config: {
          type: "FLATTENED_REPORT",
          apiEndpoint: "/orders",
          level: "order_item",
          levelKey: "item",
          flattenKey: "items",
          requires_warehouse_map: true,
          selectable_fields: {
            "01. Thông tin Định danh & Hệ thống": [
              { id: "is_primary_row", label: "is_primary_row" },
              { id: "id", label: "order_id" },
              { id: "display_id", label: "display_id" },
              { id: "system_id", label: "system_id" },
              { id: "shop_id", label: "shop_id" },
              { id: "conversation_id", label: "conversation_id" },
              { id: "order_link", label: "order_link" },
              { id: "tracking_link", label: "tracking_link" }
            ],
            "02. Thời gian & Trạng thái": [
              { id: "inserted_at", label: "created_at" },
              { id: "inserted_at", label: "created_date" }, 
              { id: "updated_at", label: "updated_at" },
              { id: "status", label: "status_code" },
              { id: "status_name", label: "status_name" },
              { id: "sub_status", label: "sub_status" },
              { id: "is_locked", label: "is_locked" },
              { id: "received_at_shop", label: "is_received_at_shop" }
            ],
            "03. Nguồn & Marketing": [
              { id: "order_sources_name", label: "source_name" },
              { id: "order_sources", label: "source_id" },
              { id: "ads_source", label: "ads_source" },
              { id: "ad_id", label: "ad_id" },
              { id: "page_id", label: "page_id" },
              { id: "page.name", label: "page_name" },
              { id: "page.username", label: "page_username" },
              { id: "post_id", label: "post_id" },
              { id: "marketer", label: "marketer_id" },
              { id: "p_utm_source", label: "utm_source" },
              { id: "p_utm_medium", label: "utm_medium" },
              { id: "p_utm_campaign", label: "utm_campaign" },
              { id: "p_utm_content", label: "utm_content" },
              { id: "p_utm_term", label: "utm_term" }
            ],
            "04. Nhân sự (Người dùng)": [
              { id: "creator.id", label: "creator_id" },
              { id: "creator.name", label: "creator_name" },
              { id: "assigning_seller.name", label: "seller_name" },
              { id: "assigning_seller_id", label: "seller_id" },
              { id: "time_assign_seller", label: "seller_assigned_at" },
              { id: "assigning_care.name", label: "care_staff_name" },
              { id: "assigning_care_id", label: "care_staff_id" },
              { id: "time_assign_care", label: "care_assigned_at" },
              { id: "last_editor.name", label: "last_editor_name" }
            ],
            "05. Khách hàng & Địa chỉ": [
              { id: "customer.id", label: "customer_system_id" },
              { id: "customer.customer_id", label: "customer_uuid" },
              { id: "bill_full_name", label: "customer_name" },
              { id: "bill_phone_number", label: "customer_phone" },
              { id: "bill_email", label: "customer_email" },
              { id: "gender", label: "customer_gender" },
              { id: "shipping_address.full_address", label: "full_address" },
              { id: "shipping_address.address", label: "street_address" },
              { id: "shipping_address.commnue_name", label: "ward_name" },
              { id: "shipping_address.district_name", label: "district_name" },
              { id: "shipping_address.province_name", label: "province_name" },
              { id: "shipping_address.post_code", label: "postal_code" }
            ],
            "06. Tài chính (Tổng quan)": [
              { id: "order_currency", label: "currency" },
              { id: "total_price", label: "total_amount" },
              { id: "total_price_after_sub_discount", label: "total_after_sub_discount" },
              { id: "total_discount", label: "total_discount" },
              { id: "money_to_collect", label: "amount_to_collect" },
              { id: "cod", label: "cod_amount" },
              { id: "partner.cod", label: "carrier_cod_amount" },
              { id: "tax", label: "tax_amount" },
              { id: "surcharge", label: "surcharge_amount" },
              { id: "cost_surcharge", label: "surcharge_cost" },
              { id: "shipping_fee", label: "shipping_fee_customer" },
              { id: "partner_fee", label: "shipping_fee_carrier" },
              { id: "fee_marketplace", label: "marketplace_fee" },
              { id: "customer_pay_fee", label: "is_customer_paying_shipping" },
              { id: "is_free_shipping", label: "is_free_shipping" }
            ],
            "07. Thanh toán": [
              { id: "payment_method_string", label: "payment_methods" },
              { id: "cash", label: "payment_cash" },
              { id: "transfer_money", label: "payment_transfer" },
              { id: "charged_by_card", label: "payment_card" },
              { id: "charged_by_momo", label: "payment_momo" },
              { id: "charged_by_vnpay", label: "payment_vnpay" },
              { id: "charged_by_qrpay", label: "payment_qrpay" },
              { id: "charged_by_kredivo", label: "payment_kredivo" },
              { id: "charged_by_fundiin", label: "payment_fundiin" },
              { id: "prepaid", label: "payment_prepaid" },
              { id: "prepaid_by_point.point", label: "payment_points" },
              { id: "exchange_value", label: "exchange_value" }
            ],
            "08. Vận chuyển & Kho": [
              { id: "partner.partner_name", label: "carrier_name" },
              { id: "partner.extend_code", label: "tracking_code" },
              { id: "time_send_partner", label: "sent_to_carrier_at" },
              { id: "additional_info.service_partner", label: "shipping_service" },
              { id: "warehouse_id", label: "warehouse_id" },
              { id: "warehouse_name", label: "warehouse_name" },
              { id: "warehouse_info.full_address", label: "warehouse_address" }
            ],
            "09. Chi tiết Sản phẩm (Item)": [
              { id: "total_quantity", label: "order_total_quantity" },
              { id: "items_length", label: "order_item_count" },
              // --- Chi tiết Item ---
              { id: "item.id", label: "item_id" },
              { id: "item.variation_info.product_display_id", label: "product_code" },
              { id: "item.variation_info.display_id", label: "sku_code" },
              { id: "item.variation_info.name", label: "product_name" },
              { id: "item.quantity", label: "item_quantity" },
              { id: "item.variation_info.retail_price", label: "item_retail_price" },
              { id: "item.variation_info.last_imported_price", label: "item_cost_price" },
              { id: "item.discount_each_product", label: "item_discount" },
              { id: "item_price_after_discount", label: "item_price_final" },
              { id: "item_total_value", label: "item_total_amount" },
              { id: "item.variation_info.weight", label: "item_weight" },
              { id: "item.note", label: "item_note" },
              { id: "item.is_bonus_product", label: "is_bonus_item" },
              { id: "item.is_wholesale", label: "is_wholesale_item" }
            ],
            "10. Khác": [
              { id: "note", label: "internal_note" },
              { id: "note_print", label: "printed_note" },
              { id: "tags_string", label: "tags" },
              { id: "is_livestream", label: "is_livestream" },
              { id: "is_live_shopping", label: "is_live_shopping" },
              { id: "is_smc", label: "is_social_commerce" },
              { id: "is_exchange_order", label: "is_exchange_order" },
              { id: "returned_reason", label: "return_reason_id" },
              { id: "returned_reason_name", label: "return_reason_name" }
            ]
          }
        }
      }
    ]
  }
];