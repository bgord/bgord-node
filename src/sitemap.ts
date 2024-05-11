import { z } from 'zod';
import fs from 'node:fs/promises';

import * as Schema from './schema';

export const SitemapLoc = z
  .string()
  .min(1)
  .brand<'sitemap-loc'>();
export type SitemapLocType = z.infer<typeof SitemapLoc>;

export const SitemapLastmod = z
  .string()
  .refine(
    value => {
      const [year, month, day] = value.split('-');
      return (
        Number.isInteger(year) &&
        Number.isInteger(month) &&
        Number.isInteger(day)
      );
    },
    { message: 'sitemap.lastmod.invalid' }
  )
  .optional()
  .brand<'sitemap-lastmod'>();
export type SitemapLastmodType = z.infer<typeof SitemapLastmod>;

export const SitemapChangefreq = z
  .union([
    z.literal('always'),
    z.literal('hourly'),
    z.literal('daily'),
    z.literal('weekly'),
    z.literal('monthly'),
    z.literal('yearly'),
    z.literal('never'),
  ])
  .optional()
  .brand<'sitemap-changefreq'>();
export type SitemapChangefreqType = z.infer<typeof SitemapChangefreq>;

export const SitemapPriority = z
  .number()
  .min(0)
  .max(1)
  .default(0.5)
  .brand<'sitemap-priority'>();
export type SitemapPriorityType = z.infer<typeof SitemapPriority>;

export const SitemapEntry = z
  .object({
    loc: SitemapLoc,
    lastmod: SitemapLastmod,
    changefreq: SitemapChangefreq,
    priority: SitemapPriority,
  })
  .brand<'sitemap-entry'>();
export type SitemapEntryType = z.infer<typeof SitemapEntry>;

export type SitemapConfigType = {
  path?: Schema.PathType;
  entries: SitemapEntryType[];
  BASE_URL: Schema.UrlWithoutTrailingSlashType;
};

export class Sitemap {
  static DEFAULT_PATH = Schema.Path.parse('static/sitemap.xml');

  private static generate(config: SitemapConfigType) {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const entry of config.entries) {
      {
        let output = '<url>\n';
        output += `\t<loc>${config.BASE_URL}${entry.loc}</loc>\n`;

        if (entry.lastmod) {
          output += `\t<lastmod>${entry.lastmod}</lastmod>\n`;
        }

        if (entry.changefreq) {
          output += `\t<changefreq>${entry.changefreq}</changefreq>\n`;
        }

        output += `\t<priority>${entry.priority}</priority>\n`;

        output += '</url>\n';

        sitemap += output;
      }
    }

    sitemap += '</urlset>';

    return sitemap;
  }

  static async save(config: SitemapConfigType) {
    const output = config.path ?? Sitemap.DEFAULT_PATH;
    const content = Sitemap.generate(config);

    return fs.writeFile(output, content);
  }
}
