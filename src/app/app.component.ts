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

  @ViewChild('componentOutlet', { read: ViewContainerRef }) outlet: ViewContainerRef;

  loadA() {
    this.dynamicComponentSvc.createComponent({
      modulePath:'src/app/lazy-components/a/a.module#AModule', 
      selectorName: ComponentSelectors.AComponent, 
      outlet: this.outlet
    });
  }

  loadB1() { 
    this.dynamicComponentSvc.createComponent({
      modulePath:'src/app/lazy-components/b/b.module#BModule', 
      selectorName: ComponentSelectors.B1Component, 
      outlet: this.outlet
    });
  }
  
  loadB2() { 
    this.dynamicComponentSvc.createComponent({
      modulePath:'src/app/lazy-components/b/b.module#BModule', 
      selectorName: ComponentSelectors.B2Component, 
      outlet: this.outlet
    });
  }

}
