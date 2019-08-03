import { Component, NgModuleFactoryLoader, Injector, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentSelectors } from './component-selectors';
import { DynamicComponentsService } from './dynamic-components.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {

  constructor(
    private dynamicComponentSvc: DynamicComponentsService
  ) {}

  @ViewChild('componentOutlet', { read: ViewContainerRef, static: false }) outlet: ViewContainerRef;

  loadA() {
    this.dynamicComponentSvc.createComponent({
      module: () => import('src/app/lazy-components/a/a.module').then(mod => mod.AModule),
      selectorName: ComponentSelectors.AComponent, 
      outlet: this.outlet
    });
  }

  loadB1() { 
    this.dynamicComponentSvc.createComponent({
      module: () => import('src/app/lazy-components/b/b.module').then(mod => mod.BModule), 
      selectorName: ComponentSelectors.B1Component, 
      outlet: this.outlet
    });
  }
  
  loadB2() { 
    this.dynamicComponentSvc.createComponent({
      module: () => import('src/app/lazy-components/b/b.module').then(mod => mod.BModule),
      selectorName: ComponentSelectors.B2Component, 
      outlet: this.outlet
    });
  }

}
