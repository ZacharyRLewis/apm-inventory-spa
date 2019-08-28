import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent, DeploymentListComponent, InventoryComponent, MaintenanceComponent, WorkflowsComponent} from './components';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'deployments', component: DeploymentListComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: 'maintenance', component: MaintenanceComponent},
  {path: 'workflows', component: WorkflowsComponent},
  {path: '', redirectTo: 'inventory', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
