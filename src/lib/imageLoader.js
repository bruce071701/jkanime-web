export default function cloudflareImageLoader({ src, width, quality }) {
  // 如果是外部 URL，直接返回
  if (src.startsWith('http')) {
    return src;
  }
  
  // 对于本地图片，使用 Cloudflare 的图片优化
  const params = [`w=${width}`];
  
  if (quality) {
    params.push(`q=${quality}`);
  }
  
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}/${src}`;
}