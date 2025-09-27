// 动态生成sitemap的工具函数
import { apiService } from '../services/api';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jkanimeflv.com') {
    this.baseUrl = baseUrl;
  }

  // 生成静态页面的sitemap条目
  getStaticPages(): SitemapUrl[] {
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        loc: `${this.baseUrl}/`,
        lastmod: today,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/peliculas`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/series`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/generos`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/buscar`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: `${this.baseUrl}/historial`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.6
      }
    ];
  }

  // 生成分类页面的sitemap条目
  async getGenrePages(): Promise<SitemapUrl[]> {
    try {
      const genres = await apiService.getGenres();
      const today = new Date().toISOString().split('T')[0];

      return genres.slice(0, 20).map(genre => ({
        loc: `${this.baseUrl}/generos?genre=${encodeURIComponent(genre.genre)}`,
        lastmod: today,
        changefreq: 'weekly' as const,
        priority: genre.count > 500 ? 0.8 : 0.7
      }));
    } catch (error) {
      console.error('Error fetching genres for sitemap:', error);
      return [];
    }
  }

  // 生成动漫详情页面的sitemap条目
  async getAnimePages(limit: number = 100): Promise<SitemapUrl[]> {
    try {
      const urls: SitemapUrl[] = [];
      const today = new Date().toISOString().split('T')[0];

      // 获取最新的电影
      const moviesData = await apiService.getAnimeList({
        type: 'movie',
        page: 1,
        size: Math.floor(limit / 2),
        sort: 'latest'
      });

      // 获取最新的系列
      const seriesData = await apiService.getAnimeList({
        type: 'series',
        page: 1,
        size: Math.floor(limit / 2),
        sort: 'latest'
      });

      // 添加电影页面
      moviesData.list.forEach(anime => {
        urls.push({
          loc: `${this.baseUrl}/anime/${anime.id}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: 0.8
        });
      });

      // 添加系列页面
      seriesData.list.forEach(anime => {
        urls.push({
          loc: `${this.baseUrl}/anime/${anime.id}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: 0.8
        });
      });

      return urls;
    } catch (error) {
      console.error('Error fetching anime pages for sitemap:', error);
      return [];
    }
  }

  // 生成语言筛选页面的sitemap条目
  getLanguagePages(): SitemapUrl[] {
    const today = new Date().toISOString().split('T')[0];
    const languages = ['latino', 'castellano', 'sub'];
    const types = ['peliculas', 'series'];
    const urls: SitemapUrl[] = [];

    types.forEach(type => {
      languages.forEach(lang => {
        urls.push({
          loc: `${this.baseUrl}/${type}?lang=${lang}`,
          lastmod: today,
          changefreq: 'daily',
          priority: 0.8
        });
      });
    });

    return urls;
  }

  // 生成完整的sitemap XML
  async generateSitemapXML(): Promise<string> {
    const staticPages = this.getStaticPages();
    const genrePages = await this.getGenrePages();
    const animePages = await this.getAnimePages(50); // 限制为50个最新动漫
    const languagePages = this.getLanguagePages();

    const allUrls = [
      ...staticPages,
      ...genrePages,
      ...animePages,
      ...languagePages
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allUrls.forEach(url => {
      xml += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  }

  // 生成sitemap索引文件（如果需要多个sitemap文件）
  generateSitemapIndex(sitemapUrls: string[]): string {
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapUrls.forEach(sitemapUrl => {
      xml += `
  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`;
    });

    xml += `
</sitemapindex>`;

    return xml;
  }
}

// 导出默认实例
export const sitemapGenerator = new SitemapGenerator();