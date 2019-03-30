import { NgModule, NgModuleRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AComponent } from './a.component';
import { HmrModuleHelper } from '../../hmr-module-helper';

@NgModule({
  imports: [CommonModule],
  declarations: [AComponent],
  entryComponents: [AComponent]
})
export class AModule {
  constructor(moduleRef: NgModuleRef<AModule>) {
    HmrModuleHelper.enableHmrDynamicNgModule(module, moduleRef);
  }
}

HmrModuleHelper.enableHmrNodeModule(module);
