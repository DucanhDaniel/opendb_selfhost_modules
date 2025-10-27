// File: utils/logger.js

/**
 * Lấy timestamp theo định dạng ISO.
 * @returns {string} Timestamp
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Logger đơn giản sử dụng console, có thêm timestamp và log level.
 */
const logger = {
  /**
   * Log thông tin (info).
   * @param {...any} args - Các đối số cần log, tương tự console.log
   */
  info: (...args) => {
    console.log(`[${getTimestamp()}] [INFO]`, ...args);
  },

  /**
   * Log cảnh báo (warn).
   * @param {...any} args - Các đối số cần log, tương tự console.warn
   */
  warn: (...args) => {
    console.warn(`[${getTimestamp()}] [WARN]`, ...args);
  },

  /**
   * Log lỗi (error).
   * @param {...any} args - Các đối số cần log, tương tự console.error
   */
  error: (...args) => {
    console.error(`[${getTimestamp()}] [ERROR]`, ...args);
  },
};

export default logger;