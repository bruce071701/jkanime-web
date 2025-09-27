/**
 * 处理评分数据
 * @param rating 原始评分
 * @param voteAverage 备用评分
 * @returns 处理后的评分字符串或null
 */
export function processRating(rating: string | number, voteAverage?: string | number): string | null {
  // 优先使用voteAverage
  if (voteAverage && voteAverage !== '' && voteAverage !== '0') {
    const voteNum = Number(voteAverage);
    if (!isNaN(voteNum) && voteNum > 0) {
      let processed = voteNum / 1000;
      if (processed < 3 && processed >= 0.1) {
        processed += Math.random() * 3 + 2;
        if (processed > 10) processed = 10;
      }
      if (processed >= 0.1 && processed <= 10) {
        return processed.toFixed(2);
      }
    }
  }
  
  // 处理rating
  if (rating && rating !== '' && rating !== '0') {
    const ratingNum = Number(rating);
    if (!isNaN(ratingNum) && ratingNum > 0) {
      let processed = ratingNum / 1000;
      if (processed < 3 && processed >= 0.1) {
        processed += Math.random() * 3 + 2;
        if (processed > 10) processed = 10;
      }
      if (processed >= 0.1 && processed <= 10) {
        return processed.toFixed(2);
      }
    }
  }
  
  return null;
}

/**
 * 获取评分颜色类
 * @param rating 评分值
 * @returns Tailwind CSS颜色类
 */
export function getRatingColorClass(rating: string | number): string {
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating <= 0) return 'bg-gray-500';
  
  if (numRating >= 8.5) return 'bg-green-500';
  if (numRating >= 7.0) return 'bg-yellow-500';
  if (numRating >= 5.0) return 'bg-orange-500';
  return 'bg-red-500';
}