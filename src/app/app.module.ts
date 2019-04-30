import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServicesModule, ShareDataService} from '@win-angular/services';
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
    HttpClientModule
  ],
  exports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
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
    ShareDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
