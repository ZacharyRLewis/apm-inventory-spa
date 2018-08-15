import {Application} from './application';

export class TestDomain {
  public static APPLICATION: Application = new Application('123', 'Test', 'test', 'Test', null, [], []);
  public static TEST_MODAL: any = {
    id: 'test',
    open: () => {},
    close: () => {}
  };
}
