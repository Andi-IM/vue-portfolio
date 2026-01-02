import type { Plugin } from 'postcss';
import type { ExportedAPI } from 'autoprefixer';

declare namespace _default {
  let plugins: (Plugin & ExportedAPI)[];
}
export default _default;
