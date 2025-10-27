/**
 * Chia một mảng thành các mảng con với kích thước (size) nhất định.
 * @param {Array<any>} array - Mảng đầu vào.
 * @param {number} size - Kích thước của mỗi mảng con.
 * @returns {Array<Array<any>>} - Mảng chứa các mảng con.
 */
export function chunkArray(array, size) {
  if (!array || array.length === 0) {
    return [];
  }
  
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}