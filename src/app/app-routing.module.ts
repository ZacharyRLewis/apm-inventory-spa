import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent, DeploymentListComponent, InventoryComponent, MaintenanceComponent} from './components';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'deployments', component: DeploymentListComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: 'maintenance', component: MaintenanceComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
