import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChipsComponentModule} from '@win-angular/chips-component';
import {SelectComponentModule} from '@win-angular/select-component';
import {ModalService, ServicesModule, ShareDataService} from '@win-angular/services';
import {AutoCompleteModule, BlockUIModule, PanelModule, SidebarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {ApplicationFlyoutFilterComponent} from './application/application-flyout-filter.component';
import {ApplicationComponent} from './application/application.component';
import {InventoryComponent} from './application/inventory.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DeploymentBulkAddComponent} from './deployment/deployment-bulk-add.component';
import {DeploymentDatabaseComponent} from './deployment/deployment-database.component';
import {DeploymentFlyoutFilterComponent} from './deployment/deployment-flyout-filter.component';
import {DeploymentListComponent} from './deployment/deployment-list.component';
import {DeploymentComponent} from './deployment/deployment.component';
import {ApplicationTypeComponent} from './maintenance/application-type.component';
import {DatabaseTypeComponent} from './maintenance/database-type.component';
import {DatabaseComponent} from './maintenance/database.component';
import {HostServerComponent} from './maintenance/host-server.component';
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidenavComponent} from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationFlyoutFilterComponent,
    ApplicationTypeComponent,
    DashboardComponent,
    DatabaseComponent,
    DatabaseTypeComponent,
    DeploymentComponent,
    DeploymentBulkAddComponent,
    DeploymentDatabaseComponent,
    DeploymentFlyoutFilterComponent,
    DeploymentListComponent,
    HostServerComponent,
    InventoryComponent,
    MaintenanceComponent,
    NavbarComponent,
    SidenavComponent,
  ],
  imports: [
    AutoCompleteModule,
    ChipsComponentModule,
    CommonModule,
    FormsModule,
    PanelModule,
    SelectComponentModule,
    ServicesModule,
    SidebarModule,
    TableModule
  ],
  exports: [
    BlockUIModule,
    DeploymentListComponent,
    InventoryComponent,
    MaintenanceComponent,
    NavbarComponent,
    SidenavComponent,
  ],
  providers: [
    ModalService,
    ShareDataService,
  ]
})
export class ComponentsModule {
}
