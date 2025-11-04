import  logger  from '../../utils/logger.js';

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    logger.warn('Lỗi validation Zod:', error.errors);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu đầu vào không hợp lệ',
      errors: error.errors, // Gửi chi tiết lỗi về cho client
    });
  }
};

