import Module from 'module';
import fs from 'node:fs';
import path from 'node:path';
import { getPlaywrightModulePath, requirePlaywrightModule } from './utils';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
/* eslint-disable max-params */

/**
 * Installs require hook to transform ts.
 * Extracted from playwright.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/transform/transform.ts
 */
export function installTransform(): () => void {
  const { pirates } = requirePlaywrightModule('lib/utilsBundle.js');
  const { resolveHook, shouldTransform, transformHook } = requireTransform();

  let reverted = false;

  const originalResolveFilename = (Module as any)._resolveFilename;
  function resolveFilename(this: any, specifier: string, parent: Module, ...rest: any[]) {
    if (!reverted && parent) {
      const resolved = resolveHook(parent.filename, specifier);
      if (resolved !== undefined) specifier = resolved;
    }
    return originalResolveFilename.call(this, specifier, parent, ...rest);
  }
  (Module as any)._resolveFilename = resolveFilename;

  const revertPirates = pirates.addHook(
    (code: string, filename: string) => {
      if (!shouldTransform(filename)) return code;
      return transformHook(code, filename);
    },
    { exts: ['.ts', '.tsx', '.js', '.jsx', '.mjs'] },
  );

  return () => {
    reverted = true;
    (Module as any)._resolveFilename = originalResolveFilename;
    revertPirates();
  };
}

export function requireTransform() {
  const transformPathSince1_35 = getPlaywrightModulePath('lib/transform/transform.js');
  if (fs.existsSync(transformPathSince1_35)) {
    const { resolveHook, shouldTransform, transformHook, requireOrImport } =
      requirePlaywrightModule(transformPathSince1_35);
    return { resolveHook, shouldTransform, transformHook, requireOrImport };
  } else {
    const { resolveHook, transformHook, requireOrImport } =
      requirePlaywrightModule('lib/common/transform.js');
    // see: https://github.com/microsoft/playwright/blob/b4ffb848de1b00e9a0abad6dacdccce60cce9bed/packages/playwright-test/src/reporters/base.ts#L524
    const shouldTransform = (file: string) => !file.includes(`${path.sep}node_modules${path.sep}`);
    return { resolveHook, shouldTransform, transformHook, requireOrImport };
  }
}
