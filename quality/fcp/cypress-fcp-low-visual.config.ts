/* ------------------------------------------------------------------
 *
 * Looking for updating the "identity providers selection as-in production" screen ?
 * Take a look into the README.md file
 *
 ------------------------------------------------------------------ */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-fcp-low-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config, true);
    },
    specPattern: 'cypress/integration/visuel/*.feature',
  },
  env: {
    ...baseConfig.env,
    TAGS: '@fcpLow and @validationVisuelle and not @ignore',
  },
});
