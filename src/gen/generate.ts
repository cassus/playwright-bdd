/**
 * Generate test code.
 */
import { PickleStepType } from '@cucumber/messages';
import { PWStep, PWSuite, PWTest } from './transform';

export class PWFile {
  private lines: string[] = [];

  constructor(public suite: PWSuite) {}

  get content() {
    return this.lines.join('\n');
  }

  run() {
    this.addHeader();
    this.addTests();
    this.addFooter();
    return this;
  }

  private addHeader() {
    this.lines.push(
      `/** Generated from: ${this.suite.uri} */`,
      `import { test } from 'playwright-bdd';`,
      '',
      `test.describe('${encodeQuotes(this.suite.name)}', () => {`,
      ''
    );
  }

  private addTests() {
    this.suite.tests.forEach((test) => this.addTest(test));
  }

  private addTest(test: PWTest) {
    const steps = test.steps.map((step) => this.getStepCode(step)).map(indent);
    this.lines.push(
      ...[
        `test('${encodeQuotes(test.name)}', async ({ Given, When, Then }) => {`, // prettier-ignore
        ...steps,
        `});`,
        '',
      ].map(indent)
    );
  }

  private addFooter() {
    this.lines.push(`});`);
  }

  private getStepCode(step: PWStep) {
    const text = encodeQuotes(step.text);
    switch (step.type) {
      case PickleStepType.CONTEXT:
        return `await Given('${text}');`;
      case PickleStepType.ACTION:
        return `await When('${text}');`;
      case PickleStepType.OUTCOME:
        return `await Then('${text}');`;
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }
}

function indent(value: string) {
  return value ? `${'  '}${value}` : value;
}

function encodeQuotes(value: string) {
  return value.replaceAll(`'`, `\\'`);
}