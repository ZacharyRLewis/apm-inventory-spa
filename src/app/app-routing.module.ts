import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeploymentListComponent} from './components/deployment/deployment-list.component';
import {InventoryComponent} from './components/application/inventory.component';

const routes: Routes = [
  {path: 'deployments', component: DeploymentListComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: '', redirectTo: 'inventory', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
