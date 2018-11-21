import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ApplicationComponent} from './application/application.component';
import {DeploymentListComponent} from './deployment/deployment-list.component';
import {InventoryComponent} from './application/inventory.component';
import {DeploymentComponent} from './deployment/deployment.component';
import {ModalComponent} from './modal/modal.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidenavComponent} from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    ApplicationComponent,
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
    DeploymentListComponent,
    InventoryComponent,
    ModalComponent,
    NavbarComponent,
    SidenavComponent
  ]
})
export class ComponentsModule {
}
