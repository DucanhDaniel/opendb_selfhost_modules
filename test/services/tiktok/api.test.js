import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js';
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue, taskWorker } from '../../../src/core/jobQueue.js';
import logger from '../../../src/utils/logger.js';
import { jest } from '@jest/globals'

const app = createApiServer();

const TIKTOK_TEST_CASES = [
  {
    name: "Audience Report: Region by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Audience Report: Region by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "campaign_id", "province_id", "province_name", "campaign_name", "spend", "impressions", 
        "clicks", "ctr", "cpc", "cpm", "reach", "conversion", "cost_per_conversion", "conversion_rate", "profile_visits", "likes", 
        "comments", "shares", "follows", "video_play_actions", "video_watched_2s", "video_watched_6s", "video_views_p25", "video_views_p50", "video_views_p75", "video_views_p100", 
        "average_video_play"
      ]
    },
  },

  {
    name: "Audience Report: Country by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Audience Report: Country by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "stat_time_day", "campaign_id", "country_code", "spend", "campaign_name", "impressions", 
        "clicks", "ctr", "cpc", "cpm", "reach", "conversion", "cost_per_conversion", "conversion_rate", "video_play_actions", "likes", 
        "comments", "shares", "follows", "profile_visits"
      ]
    },
  },

  {
    name: "Audience Report: Age by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Audience Report: Age by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "stat_time_day", "campaign_id", "age", "spend", "campaign_name", "impressions", 
        "clicks", "ctr", "cpc", "cpm", "reach", "conversion", "cost_per_conversion", "conversion_rate", "video_play_actions", "likes", 
        "comments", "shares", "follows", "profile_visits"
      ]
    },
  },


  {
    name: "Audience Report: Gender by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Audience Report: Gender by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "stat_time_day", "campaign_id", "gender", "spend", "campaign_name", "impressions", 
        "clicks", "ctr", "cpc", "cpm", "reach", "conversion", "cost_per_conversion", "conversion_rate", "video_play_actions", "likes", 
        "comments", "shares", "follows", "profile_visits"
      ]
    },
  },

  {
    name: "Audience Report: Age & Gender by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Audience Report: Age & Gender by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "stat_time_day", "campaign_id", "age", "gender", "spend", "campaign_name", 
        "impressions", "clicks", "ctr", "cpc", "cpm", "reach", "conversion", "cost_per_conversion", "conversion_rate", "video_play_actions", 
        "likes", "comments", "shares", "follows", "profile_visits"
      ]
    },
  },

  {
    name: "Placement Report by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Placement Report by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "campaign_id", "placement", "campaign_name", "spend", "impressions", "clicks", 
        "ctr", "conversion", "cost_per_conversion"
      ]
    },
  },

  {
    name: "Platform Report by Campaign",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Platform Report by Campaign", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "campaign_id", "platform", "campaign_name", "spend", "impressions", "clicks", 
        "ctr", "conversion", "cost_per_conversion"
      ]
    },
  },

  {
    name: "Campaign Performance",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Campaign Performance", 
      selectedFields: [
              "spend",
              "campaign_name",
              "impressions",
              "objective_type",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "total_onsite_shopping_value",
              "purchase",
              "onsite_shopping",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views", "stat_time_day", "campaign_id", "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
      ]
    },
  },


  {
    name: "AdGroup Performance",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "AdGroup Performance", 
      selectedFields: [
              "start_date", "end_date",
              "advertiser_id",
              "advertiser_name", "stat_time_day", "adgroup_id",
              "adgroup_name",
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "purchase",
              "onsite_shopping",
              "total_onsite_shopping_value",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views",
      ]
    },
  },

  {
    name: "Ad Performance",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-11-30",
    startDate: "2025-11-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: 'Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Ad Performance", 
      selectedFields: [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name", "stat_time_day", "ad_id",
              "ad_text",
              "spend",
              "campaign_name",
              "adgroup_name",
              "ad_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "purchase",
              "onsite_shopping",
              "total_onsite_shopping_value",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views",
      ]
    },
  },

  {
    name: "Creative Performance (Video/Image)",
    taskType: "TIKTOK_TTA",
    params: {
    endDate: "2025-10-10",
    startDate: "2025-10-01", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: ' Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "Creative Performance (Video/Image)", 
      selectedFields: [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name", "ad_id",
              "campaign_id",
              "campaign_name",
              "adgroup_id",
              "adgroup_name",
              "ad_name",
              "spend",
              "impressions",
              "clicks",
              "ctr",
              "conversion",
              "cost_per_conversion",
      ]
    },
  },

  {
    name: "GMV Campaign / Creative Detail",
    taskType: "TIKTOK_GMV",
    params: {
    endDate: "2025-10-01",
    startDate: "2025-10-01",
    advertiser_id: "6967547145545105410",
    advertiser_name: "Tên advertiser",
    store_name: "Tên store",
    store_id: "7494600253418473607", 
    accountsToProcess: [ 
      { id: '6967547145545105410', name: 'Dung dịch phụ nữ Chilly' }, 
    ],
      templateName: "GMV Campaign / Creative Detail", 
      selectedFields: [
        "start_date", "end_date", "advertiser_id", "advertiser_name", "store_id", "store_name", "campaign_id", "item_group_id", "item_id", "product_img", 
        "campaign_name", "operation_status", "product_name", "product_status", "product_image_url", "creative_delivery_status", "title", "tt_account_name", "tt_account_profile_image_url", "cost", 
        "orders", "cost_per_order", "gross_revenue", "roi", "product_impressions", "product_clicks", "product_click_rate", "ad_conversion_rate", "ad_video_view_rate_2s", "ad_video_view_rate_6s", 
        "ad_video_view_rate_p25", "ad_video_view_rate_p50", "ad_video_view_rate_p75", "ad_video_view_rate_p100"
      ]
    },
  },
    {
        name: "GMV Campaign / Product Detail",
        taskType: "TIKTOK_GMV",
        params: {
            endDate: "2025-10-10",
            startDate: "2025-10-01", 
            advertiser_id: "6967547145545105410",
            advertiser_name: "Tên advertiser",
            store_name: "Tên store",
            store_id: "7494600253418473607",
            templateName: "GMV Campaign / Product Detail", 
            selectedFields: [
                "start_date", "end_date", "advertiser_id", "advertiser_name", "store_id", "store_name", "stat_time_day", "campaign_id", "item_group_id", "product_img", 
                "campaign_name", "operation_status", "bid_type", "product_name", "product_image_url", "orders", "gross_revenue", "cost", "cost_per_order", "roi"
            ]
        },
    },

  {
    name: "GMV All Campaign Performance",
    "taskType": "TIKTOK_GMV",
    "params": {
      "endDate": "2025-10-01",
      "startDate": "2025-10-01",
      "templateName": "GMV All Campaign Performance",
      "accountsToProcess": [{ "id": "6967547145545105410", "name": "Test Advertiser" }],
      "shopsToProcess": [{ "id": "7494600253418473607", "name": "Test Store" }],
      "selectedFields": [
                "start_date",
                "end_date",
                "advertiser_id",
                "advertiser_name",
                "store_id",
                "store_name", "campaign_id", "stat_time_day",
                "campaign_name",
                "cost",
                "orders",
                "roi",
                "cost_per_order",
                "gross_revenue",
                "net_cost",
                "roas_bid",
                "operation_status",
                "schedule_type",
                "schedule_start_time",
                "schedule_end_time",
                "target_roi_budget",
                "bid_type",
                "max_delivery_budget"
      ]
    }
  },

  {
    name: "GMV Product Campaign Performance",
    "taskType": "TIKTOK_GMV",
    "description": "TIKTOK_GMV TASK",
    "params": {
      "endDate": "2025-10-01",
      "startDate": "2025-10-01",
      "templateName": "GMV Product Campaign Performance",
      "accountsToProcess": [{ "id": "6967547145545105410", "name": "Test Advertiser" }],
      "shopsToProcess": [{ "id": "7494600253418473607", "name": "Test Store" }],
      "selectedFields": [
                "start_date",
                "end_date",
                "advertiser_id",
                "advertiser_name",
                "store_id",
                "store_name", "campaign_id", "stat_time_day",
                "campaign_name",
                "cost",
                "orders",
                "roi",
                "cost_per_order",
                "gross_revenue",
                "net_cost",
                "roas_bid",
                "operation_status",
                "schedule_type",
                "schedule_start_time",
                "schedule_end_time",
                "target_roi_budget",
                "bid_type",
                "max_delivery_budget"
      ]
    }
  },
  {
    name: "GMV Live Campaign Performance",
    "taskType": "TIKTOK_GMV",
    "description": "TIKTOK_GMV TASK",
    "params": {
      "endDate": "2025-10-01",
      "startDate": "2025-10-01",
      "templateName": "GMV Live Campaign Performance",
      "accountsToProcess": [{ "id": "6967547145545105410", "name": "Test Advertiser" }],
      "shopsToProcess": [{ "id": "7494600253418473607", "name": "Test Store" }],
      "selectedFields": [
                "start_date",
                "end_date",
                "advertiser_id",
                "advertiser_name",
                "store_id",
                "store_name", "campaign_id", "stat_time_day",
                "campaign_name",
                "cost",
                "orders",
                "roi",
                "cost_per_order",
                "gross_revenue",
                "net_cost",
                "roas_bid",
                "operation_status",
                "schedule_type",
                "schedule_start_time",
                "schedule_end_time",
                "target_roi_budget",
                "bid_type",
                "max_delivery_budget"
      ]
    }
  }
  
];

const TEST_USER = {
  username: "tiktok_tester",
  email: "tiktok_tester@opendb.com",
  password: "password123",
  settings: {
    "TIKTOK_ACCESS_TOKEN": process.env.TIKTOK_ACCESS_TOKEN || "mock-token",
    // Thêm license key nếu cần
    "SAVED_LICENSE_KEY": "VALID-LICENSE",
    "TIKTOK_CLIENT_ID": process.env.TIKTOK_CLIENT_ID,
    "TIKTOK_CLIENT_SECRET": process.env.TIKTOK_CLIENT_SECRET
  }
};

describe('TIKTOK Module E2E Test Suite', () => {
  let token;
  let userId;

  // --- SETUP (Chạy 1 lần) ---
  beforeAll(async () => {

    // jest.spyOn(console, 'log').mockImplementation(() => {});
    // jest.spyOn(console, 'info').mockImplementation(() => {});

    
    initializeWorker();
    
    // Get or Create User
    let user = await prisma.user.findUnique({ where: { email: TEST_USER.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: TEST_USER.username,
          email: TEST_USER.email,
          password: await authService.hashPassword(TEST_USER.password),
          settings: TEST_USER.settings
        }
      });
    } else {
        // Update settings mới nhất (token)
        await prisma.user.update({
            where: { id: user.id },
            data: { settings: TEST_USER.settings }
        });
    }
    userId = user.id;
    token = authService.generateAccessToken(user);
  });

  afterAll(async () => {
    if (userId) {
        await prisma.taskLog.deleteMany({ where: { userId } });
        await prisma.taskMetric.deleteMany({ where: { userId } });
    }
    await taskQueue.close();

    if (taskWorker) {
      await taskWorker.close();
  }
  
    await prisma.$disconnect();
  });

  test.each(TIKTOK_TEST_CASES)('Should process report: $name', async (testCase) => {
    logger.info(`\n🧪 Đang test template: ${testCase.name}`);
    
    // 1. Initiate
    const initRes = await request(app)
      .post('/api/v1/task/initiate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        taskType: testCase.taskType,
        description: `E2E Test: ${testCase.name}`,
        params: testCase.params
      });

    if (initRes.statusCode !== 201) console.error(initRes.body);
    expect(initRes.statusCode).toBe(201);
    const taskId = initRes.body.taskId;

    // 2. Execute
    const execRes = await request(app)
      .post('/api/v1/task/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(execRes.statusCode).toBe(202);

    // 3. Poll Status
    let status = 'QUEUED';
    let attempts = 0;
    while (status !== 'COMPLETED' && status !== 'FAILED' && attempts < 90) { // max attempts lên 90
      attempts++;
      await new Promise(r => setTimeout(r, 2000));

      const statusRes = await request(app)
        .get('/api/v1/task/get/status')
        .query({ taskId })
        .set('Authorization', `Bearer ${token}`);
      
      status = statusRes.body.status;
      // logger.info(`   [${testCase.name}] Poll #${attempts}: ${status}`);
    }

    if (status === 'FAILED') {
        console.error(`❌ Task Failed: ${testCase.name}`);
        // (Tùy chọn) Gọi API lấy log chi tiết để debug
    }

    expect(status).toBe('COMPLETED');
    logger.info(`✅ Test Passed: ${testCase.name}`);

  }, 180000); // Timeout 3 phút cho mỗi test case 

});