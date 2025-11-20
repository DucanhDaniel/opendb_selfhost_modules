/**
 * Hàm "ngủ" (sleep) non-blocking.
 * @param {number} ms - Số mili-giây cần chờ.
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));