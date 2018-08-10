import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InventoryComponent} from './components/inventory/inventory.component';

const routes: Routes = [
  {path: 'inventory', component: InventoryComponent},
  {path: '', redirectTo: 'inventory', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
