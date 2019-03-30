import { Component } from '@angular/core';
import { ComponentSelectors } from '../../component-selectors';
import { DynamicComponentsService } from '../../dynamic-components.service';

@Component({
  selector: ComponentSelectors.AComponent,
  template: `
<div class="lazy-component" (click)="closeMe()">
  <ng-container *ngIf="loading">
    <img src="assets/loading.gif" class="loadingImage">
  </ng-container>
  {{content}}
</div>
`,
styleUrls: [ '../../lazy.component.css', './a.component.css' ]
})
export class AComponent  {
  loading: boolean = true;
  content: string;

  constructor(
    private dynamicComponentSvc: DynamicComponentsService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      this.content = 'A';
      //uncomment this next line to see this component dynamically reload
      //this.content = 'A1'
    },3000)
  }

  closeMe() {
    this.dynamicComponentSvc.closeComponent(this);
  }
}
