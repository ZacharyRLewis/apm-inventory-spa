import {Application} from './application';
import {ApplicationType} from './application-type';

export class TestDomain {
  public static APPLICATION: Application = new Application('123', 'Test', 'test', 'Test', false, null, [], []);
  public static APPLICATION_TYPE: ApplicationType = new ApplicationType(1, 'Java', 'JDK 1.8', 'Java 8 Application');
  public static TEST_MODAL: any = {
    id: 'test',
    open: () => {},
    close: () => {}
  };
}
