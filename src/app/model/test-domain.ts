import {Application} from './application';
import {ApplicationDependency} from './application-dependency';
import {ApplicationType} from './application-type';
import {ApplicationWorkflow} from './application-workflow';
import {ApplicationWorkflowStatus} from './application-workflow-status';
import {Database} from './database';
import {DatabaseType} from './database-type';
import {Dependency} from './dependency';
import {Deployment} from './deployment';
import {DeploymentDatabase} from './deployment-database';
import {GithubRepository} from './github/github-repository';
import {GithubTeam} from './github/github-team';
import {HostServer} from './host-server';
import {MulesoftApi} from './mulesoft/mulesoft-api';
import {Permissions} from './permissions';

export class TestDomain {
  public static APPLICATION: Application = new Application(
    '123', 'Test', 'test', 'Test', '', '', false, null, null, null, null, null, null, [], ['test'], [], []
  );
  public static APPLICATION_DEPENDENCY: ApplicationDependency = new ApplicationDependency('1', '2', '3');
  public static APPLICATION_TYPE: ApplicationType = new ApplicationType('123', 'Java', 'JDK 1.8', 'Java 8 Application');
  public static APPLICATION_WORKFLOW: ApplicationWorkflow = new ApplicationWorkflow('1', '1', '1', 'TEST', 'test', 'Test');
  public static APPLICATION_WORKFLOW_STATUS: ApplicationWorkflowStatus = new ApplicationWorkflowStatus('1', 'TEST', 'Testing');
  public static DEPLOYMENT: Deployment = new Deployment('123', '123', 'DEV', '123', '/tmp', 'test-service', '1234', false);
  public static DEPLOYMENT_DATABASE = new DeploymentDatabase('123', '1', '1', 'TEST');
  public static DATABASE: Database = new Database('123', 'testdb', 'localhost', '5432', null, 'DEV');
  public static DATABASE_TYPE: DatabaseType = new DatabaseType('123', 'postgres');
  public static DEPENDENCY: Dependency = new Dependency('123', 'test', 'test@1.0', '1.0');
  public static GITHUB_REPO: GithubRepository = new GithubRepository(1, 'test', 'develop');
  public static GITHUB_TEAM: GithubTeam = new GithubTeam(1, 'Test', 'test');
  public static HOST_SERVER: HostServer = new HostServer('123', 'localhost', 'DEV', 'LINUX');
  public static MULESOFT_API: MulesoftApi = new MulesoftApi(123, '2019-03-01', '2019-03-02');
  public static PERMISSIONS: Permissions = new Permissions('test', ['APM_Admin']);
}
