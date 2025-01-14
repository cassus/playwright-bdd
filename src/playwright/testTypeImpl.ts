/**
 * Helpers to deal with Playwright test internal stuff.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/common/testType.ts
 */
import { test, Fixtures } from '@playwright/test';
import { Location } from '@playwright/test/reporter';
import { getSymbolByName } from '../utils';
import { TestTypeCommon } from './types';

type FixturesWithLocation = {
  fixtures: Fixtures;
  location: Location;
};

const testTypeSymbol = getSymbolByName(test, 'testType');

/**
 * Returns test fixtures using Symbol.
 */
function getTestFixtures(test: TestTypeCommon) {
  return getTestImpl(test).fixtures as FixturesWithLocation[];
}

function getTestImpl(test: TestTypeCommon) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return test[testTypeSymbol] as any;
}

/**
 * Run step with location pointing to Given, When, Then call.
 */
// eslint-disable-next-line max-params
export async function runStepWithCustomLocation(
  test: TestTypeCommon,
  stepText: string,
  location: Location,
  body: () => unknown,
) {
  const testInfo = test.info();

  // See: https://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/testType.ts#L221
  // @ts-expect-error _runAsStep is hidden from public
  return testInfo._runAsStep({ category: 'test.step', title: stepText, location }, async () => {
    return await body();
  });
}

/**
 * Returns true if all fixtures of parent test found in child test.
 */
export function isParentChildTest(parent: TestTypeCommon, child: TestTypeCommon) {
  if (parent === child) return false;
  const childLocationsSet = new Set(
    getTestFixtures(child).map((f) => locationToString(f.location)),
  );
  return getTestFixtures(parent).every((f) => {
    return childLocationsSet.has(locationToString(f.location));
  });
}

function locationToString({ file, line, column }: Location) {
  return `${file}:${line}:${column}`;
}
