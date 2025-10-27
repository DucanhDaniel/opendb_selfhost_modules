export function generateMonthlyDateChunks(startDate, endDate) {
  const chunks = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const chunkStart = current.toISOString().split('T')[0];
    
    // Find the end of the current month
    let chunkEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    // If end of month is after the total end date, use total end date
    if (chunkEnd > end) {
      chunkEnd = end;
    }

    chunks.push({
      start: chunkStart,
      end: chunkEnd.toISOString().split('T')[0],
    });

    // Move to the first day of the next month
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }
  return chunks;
}