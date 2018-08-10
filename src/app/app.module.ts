import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TableModule} from 'primeng/table';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import {ApplicationService, ModalService} from './services';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    ComponentsModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    TableModule
  ],
  providers: [ApplicationService, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
