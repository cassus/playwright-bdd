import React from 'react';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { ComponentWithAsset } from '../components/ComponentWithAsset';

const { Given, When, Then } = createBdd(test);

Given('Mounted input component', async ({ mount }) => {
  // use <textarea> instead of <input>
  // see: https://github.com/microsoft/playwright/issues/28566
  await mount(<textarea data-testid="textField" />);
});

Given('Mounted component with asset imported', async ({mount}) => {
  await mount(<ComponentWithAsset />);
});


When('I type {string}', async ({ page }, arg: string) => {
  await page.getByTestId('textField').fill(arg);
});

Then('input field has {string}', async ({ page }, arg: string) => {
  await expect(page.getByTestId('textField')).toHaveValue(arg);
});

Given(
  'Mounted button with an event handler that record how many times it was pressed',
  async ({ mount, world }) => {
    await mount(
      <button type="button" data-testid="button" onClick={() => (world.clickedTimes += 1)} />,
    );
  },
);

When('I press the button', async ({ page }) => {
  await page.getByTestId('button').click();
});

Then(
  'the recorded number of times the button was pressed is {int}',
  async ({ world }, arg: number) => {
    expect(world.clickedTimes).toBe(arg);
  },
);
