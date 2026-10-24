import { defineConfig } from 'astro/config';
import { seoFiles } from './integrations/seo-files/index.js';

export default defineConfig({
  site: 'https://scentscape.com.co',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [seoFiles()],
});
