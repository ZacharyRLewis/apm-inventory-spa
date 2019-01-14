import {Application} from './application';
import {ApplicationType} from './application-type';
import {Database} from './database';
import {DatabaseType} from './database-type';
import {Deployment} from './deployment';

export class TestDomain {
  public static APPLICATION: Application = new Application('123', 'Test', 'test', 'Test', false, null, [], []);
  public static APPLICATION_TYPE: ApplicationType = new ApplicationType('123', 'Java', 'JDK 1.8', 'Java 8 Application');
  public static DEPLOYMENT: Deployment = new Deployment('123', '123', 'DEV', 'localhost', '/tmp', 'test-service', '1234', false);
  public static DATABASE: Database = new Database('123', 'testdb', 'localhost', '5432', null, 'DEV');
  public static DATABASE_TYPE: DatabaseType = new DatabaseType('123', 'postgres');
  public static TEST_MODAL: any = {
    id: 'test',
    open: () => {},
    close: () => {}
  };
}
