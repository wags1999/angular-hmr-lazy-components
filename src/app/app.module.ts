import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DynamicComponentsService } from './dynamic-components.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  providers:    [
    {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
    DynamicComponentsService
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
