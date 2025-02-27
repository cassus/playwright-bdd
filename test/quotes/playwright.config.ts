import { defineConfig } from '@playwright/test';
import { defineBddConfig } from '../../dist';

export default defineConfig({
  projects: [
    {
      name: 'single-qoutes',
      testDir: defineBddConfig({
        quotes: 'single',
        outputDir: `.features-gen/single`,
        paths: ['*.feature'],
        require: ['steps.ts'],
      }),
    },
    {
      name: 'double-qoutes',
      testDir: defineBddConfig({
        quotes: 'double',
        outputDir: `.features-gen/double`,
        paths: ['*.feature'],
        require: ['steps.ts'],
      }),
    },
    {
      name: 'backtick-quotes',
      testDir: defineBddConfig({
        quotes: 'backtick',
        outputDir: `.features-gen/backtick`,
        paths: ['*.feature'],
        require: ['steps.ts'],
      }),
    },
  ],
  forbidOnly: Boolean(process.env.FORBID_ONLY),
});
