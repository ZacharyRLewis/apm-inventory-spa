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
  ApplicationService,
  ApplicationTypeService,
  DatabaseService,
  DatabaseTypeService,
  DependencyService,
  DeploymentDatabaseService,
  DeploymentService,
  HostServerService,
  MulesoftApiService
} from './services';
import {ApplicationDependencyService} from './services/application-dependency/application-dependency.service';
import {PermissionsService} from './services/permission/permission.service';
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
    DatabaseService,
    DatabaseTypeService,
    DependencyService,
    DeploymentService,
    DeploymentDatabaseService,
    HostServerService,
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
