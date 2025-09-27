/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * 获取年份
 * @param dateString 日期字符串
 * @returns 年份
 */
export function getYear(dateString: string): number | null {
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return null;
  }
}

/**
 * 格式化类型显示
 * @param type 类型
 * @returns 格式化后的类型
 */
export function formatType(type: string): string {
  const lowerType = type.toLowerCase();
  switch (lowerType) {
    case 'movie':
      return 'Película';
    case 'series':
    case 'serie':
      return 'Serie';
    case 'ova':
      return 'OVA';
    case 'ona':
      return 'ONA';
    case 'tv':
      return 'TV';
    case 'special':
      return 'Especial';
    default:
      return type;
  }
}

/**
 * 格式化状态显示
 * @param status 状态
 * @returns 格式化后的状态
 */
export function formatStatus(status: string): string {
  switch (status) {
    case 'ongoing':
      return 'En emisión';
    case 'completed':
      return 'Completo';
    default:
      return status;
  }
}

/**
 * 格式化语言显示
 * @param lang 语言
 * @returns 格式化后的语言
 */
export function formatLang(lang: string): string {
  switch (lang) {
    case 'sub':
      return 'Subtítulos';
    case 'dub':
      return 'Doblado';
    case 'latino':
      return 'Latino';
    case 'castellano':
      return 'Español';
    default:
      return lang;
  }
}

/**
 * 检查是否为电影类型
 * @param type 类型
 * @returns 是否为电影
 */
export function isMovieType(type: string): boolean {
  const lowerType = type.toLowerCase();
  return lowerType === 'movie';
}

/**
 * 检查是否为系列类型
 * @param type 类型
 * @returns 是否为系列
 */
export function isSeriesType(type: string): boolean {
  const lowerType = type.toLowerCase();
  return lowerType === 'series' || lowerType === 'serie' || lowerType === 'tv';
}