// src/services/data.service.js
import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';
// (Đảm bảo đường dẫn này đúng với cấu trúc của bạn)

/**
 * [PHIÊN BẢN ĐÚNG]
 *
 * @param {string} userId - ID của user (từ token)
 * @param {object} options - { sheetName, limit, page }
 */
async function queryData(userId, { sheetName, limit, page }) {
  const take = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * take;

  try {

    // 2. Lấy tên bảng động từ config
    const tableName = sheetName; // Ví dụ: "FAD_AdPerformanceReport"

    if (!tableName || !prisma[tableName]) {
       throw new Error(`Tên bảng '${tableName}' không hợp lệ hoặc không tồn tại trong Prisma Client.`);
    }

    // 3. Xây dựng Where Clause
    const whereClause = {
      user_id: userId,
    };

    // 4. Lấy dữ liệu và đếm
    const dataPromise = prisma[tableName].findMany({
      where: whereClause,
      take: take,
      skip: skip,
      orderBy: {
        createdAt: 'desc', 
      },
    });

    const countPromise = prisma[tableName].count({
      where: whereClause,
    });

    // 5. Thực thi song song
    const [data, totalCount] = await prisma.$transaction([
      dataPromise,
      countPromise,
    ]);
    
    // 6. Trả về kết quả
    return {
      success: true,
      pagination: {
        page: page,
        limit: take,
        totalRows: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
      data: data,
    };
  } catch (error) {
    logger.error(`Lỗi khi truy vấn data: ${error.message}`);
    throw new Error('Lỗi khi truy vấn cơ sở dữ liệu'); 
  }
}

export const dataService = {
  queryData,
};