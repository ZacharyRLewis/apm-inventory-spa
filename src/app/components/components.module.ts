import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ModalService, ServicesModule} from '@win-angular/services';
import {TableModule} from 'primeng/table';
import {ApplicationComponent} from './application/application.component';
import {InventoryComponent} from './application/inventory.component';
import {DatabaseListComponent} from './database/database-list.component';
import {DatabaseComponent} from './database/database.component';
import {DeploymentListComponent} from './deployment/deployment-list.component';
import {DeploymentComponent} from './deployment/deployment.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ApplicationTypeComponent} from './type/application-type.component';
import {DatabaseTypeComponent} from './type/database-type.component';
import {TypeListComponent} from './type/type-list.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationTypeComponent,
    DatabaseComponent,
    DatabaseTypeComponent,
    DatabaseListComponent,
    DeploymentComponent,
    DeploymentListComponent,
    InventoryComponent,
    NavbarComponent,
    SidenavComponent,
    TypeListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ServicesModule
  ],
  exports: [
    DatabaseListComponent,
    DeploymentListComponent,
    InventoryComponent,
    NavbarComponent,
    SidenavComponent,
    TypeListComponent
  ],
  providers: [
    ModalService
  ]
})
export class ComponentsModule {
}
