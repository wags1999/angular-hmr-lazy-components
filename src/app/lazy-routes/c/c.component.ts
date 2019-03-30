import { Component } from '@angular/core';
import { ComponentSelectors } from '../../component-selectors';
import { DynamicComponentsService } from '../../dynamic-components.service';

@Component({
  selector: 'my-c',
  template: `
<div class="lazy-component">
  <ng-container *ngIf="loading">
    <img src="assets/loading.gif" class="loadingImage">
  </ng-container>
  {{content}}
</div>
`,
styleUrls: [ '../../lazy.component.css', './c.component.css' ]
})
export class CComponent  {
  loading: boolean = true;
  content: string;

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      this.content = 'C';
      //uncomment this next line to see this component dynamically reload
      //this.content = 'C1'
    },3000)
  }
}
