import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServicesModule, ShareDataService} from '@win-angular/services';
import {NgxPermissionsModule} from 'ngx-permissions';
import {GrowlModule} from 'primeng/growl';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import {
  ApplicationDependencyService,
  ApplicationService,
  ApplicationTypeService,
  ApplicationWorkflowService,
  ApplicationWorkflowStatusService,
  DatabaseService,
  DatabaseTypeService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService, GithubRepositoryService, GithubTeamService,
  HostServerService,
  MulesoftApiService,
  PermissionsService
} from './services';
import {ServiceInterceptor} from './services/service.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ComponentsModule,
    GrowlModule,
    HttpClientModule,
    NgxPermissionsModule.forRoot()
  ],
  exports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    NgxPermissionsModule,
    ServicesModule
  ],
  providers: [
    ApplicationService,
    ApplicationDependencyService,
    ApplicationTypeService,
    ApplicationWorkflowService,
    ApplicationWorkflowStatusService,
    DatabaseService,
    DatabaseTypeService,
    DependencyService,
    DeploymentService,
    DeploymentDatabaseService,
    HostServerService,
    GithubRepositoryService,
    GithubTeamService,
    MulesoftApiService,
    PermissionsService,
    ShareDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
