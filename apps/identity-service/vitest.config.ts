import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite()],
  test: { globals: false, setupFiles: ['./test/setup.ts'], fileParallelism: false },
});
