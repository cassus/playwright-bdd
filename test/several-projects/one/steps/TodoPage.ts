import { Fixture, Given } from '../../../../dist/decorators';
import { test } from './fixtures';

export
@Fixture<typeof test>('todoPage')
class TodoPage {
  @Given('TodoPage: step')
  async step() {}
}
