import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  TypeListComponent,
  DatabaseListComponent,
  DeploymentListComponent,
  InventoryComponent
} from './components';

const routes: Routes = [
  {path: 'databases', component: DatabaseListComponent},
  {path: 'deployments', component: DeploymentListComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: 'types', component: TypeListComponent},
  {path: '', redirectTo: 'inventory', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
