import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://scentscape.com.co',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
