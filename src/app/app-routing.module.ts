import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  ApplicationTypeListComponent,
  DatabaseListComponent,
  DatabaseTypeListComponent,
  DeploymentListComponent,
  InventoryComponent
} from './components';

const routes: Routes = [
  {path: 'application-types', component: ApplicationTypeListComponent},
  {path: 'databases', component: DatabaseListComponent},
  {path: 'database-types', component: DatabaseTypeListComponent},
  {path: 'deployments', component: DeploymentListComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: '', redirectTo: 'inventory', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
