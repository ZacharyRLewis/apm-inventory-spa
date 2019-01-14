import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ApplicationTypeListComponent} from './application-type/application-type-list.component';
import {ApplicationTypeComponent} from './application-type/application-type.component';
import {ApplicationComponent} from './application/application.component';
import {InventoryComponent} from './application/inventory.component';
import {DatabaseTypeListComponent} from './database-type/database-type-list.component';
import {DatabaseTypeComponent} from './database-type/database-type.component';
import {DatabaseListComponent} from './database/database-list.component';
import {DatabaseComponent} from './database/database.component';
import {DeploymentListComponent} from './deployment/deployment-list.component';
import {DeploymentComponent} from './deployment/deployment.component';
import {ModalComponent} from './modal/modal.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidenavComponent} from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationTypeComponent,
    ApplicationTypeListComponent,
    DatabaseComponent,
    DatabaseTypeComponent,
    DatabaseTypeListComponent,
    DatabaseListComponent,
    DeploymentComponent,
    DeploymentListComponent,
    InventoryComponent,
    ModalComponent,
    NavbarComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule
  ],
  exports: [
    ApplicationTypeListComponent,
    DatabaseListComponent,
    DatabaseTypeListComponent,
    DeploymentListComponent,
    InventoryComponent,
    ModalComponent,
    NavbarComponent,
    SidenavComponent
  ]
})
export class ComponentsModule {
}
