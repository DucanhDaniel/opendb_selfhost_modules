import { dataService } from '../../services/data/data.service.js';
import logger from '../../utils/logger.js';


/**
 * [GET] /data/query
 * Lấy dữ liệu báo cáo (đã phân trang)
 */
export const handleQueryData = async (req, res, next) => {
  try {
    // Lấy userId từ token (do authMiddleware thêm vào)
    const { userId } = req.user;
    
    // Lấy các tham số từ query (đã được validatorxử lý)
    const queryOptions = req.query;

    const result = await dataService.queryData(userId, queryOptions);

    res.status(200).json(result);

  } catch (error) {
    logger.error('Lỗi trong handleQueryData:', error);
    next(error);
  }
};