import { NgModule, NgModuleRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B1Component } from './b1.component';
import { B2Component } from './b2.component';
import { HmrModuleHelper } from '../../hmr-module-helper';

@NgModule({
  imports: [CommonModule],
  declarations: [B1Component,B2Component],
  entryComponents: [B1Component,B2Component]
})
export class BModule {
  constructor(moduleRef: NgModuleRef<BModule>) {
    HmrModuleHelper.enableHmrDynamicNgModule(module, moduleRef);
  }
}

HmrModuleHelper.enableHmrNodeModule(module);