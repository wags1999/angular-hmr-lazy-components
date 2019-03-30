import { Component } from '@angular/core';
import { ComponentSelectors } from '../../component-selectors';
import { DynamicComponentsService } from '../../dynamic-components.service';

@Component({
  selector: ComponentSelectors.B1Component,
  template: `
<div class="lazy-component" (click)="closeMe()">
  <ng-container *ngIf="loading">
    <img src="assets/loading.gif" class="loadingImage">
  </ng-container>
  {{content}}
</div>
`,
styleUrls: [ '../../lazy.component.css', './b1.component.css' ]
})
export class B1Component  {
  loading: boolean = true;
  content: string;

  constructor(
    private dynamicComponentSvc: DynamicComponentsService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      this.content = 'B1';
    },3000)
  }

  closeMe() {
    this.dynamicComponentSvc.closeComponent(this);
  }
}
