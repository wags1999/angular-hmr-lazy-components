import { NgModule, NgModuleRef, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CComponent } from './c.component';
import { HmrModuleHelper } from '../../hmr-module-helper';

const routes: Routes = [
  { path: '', component: CComponent }
]
const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
  imports: [CommonModule, routing],
  declarations: [CComponent],
  entryComponents: [CComponent]
})
export class CModule {
  constructor(moduleRef: NgModuleRef<CModule>) {
    HmrModuleHelper.enableHmrRouterNgModule(module, moduleRef);
  }
}

HmrModuleHelper.enableHmrNodeModule(module);
