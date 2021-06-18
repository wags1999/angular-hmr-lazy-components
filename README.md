# simulation of more upstream changes
test

# angular-hmr-lazy-components
This example shows how Angular HMR can be used to automatically reload lazy routes and lazy (dynamically-loaded) components. This can be extremely helpful for large Angular apps that take a while to JIT compile when they reload.

Notice in the animation below that moments after a change is made in the a.component.ts source code, just the "A" components already showing in the app are reloaded. 
![Image of example in action](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/img/example.gif)

# Reloading Lazy Routes

## How It Works
Most of the magic is in [hmr-module-helper.ts](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/hmr-module-helper.ts). Each module that is going to be lazy-loaded through the router will use this helper class to enable HMR for that module.  Here's how this is used in the [c module](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/lazy-routes/c/c.module.ts):
 
      export class CModule {
        constructor(moduleRef: NgModuleRef<CModule>) {
          HmrModuleHelper.enableHmrRouterNgModule(module, moduleRef);
        }
      }
      
      HmrModuleHelper.enableHmrNodeModule(module);
 
# Reloading Dynamically-Loaded Components
 
## How It Works
Reloading dynamically-loaded components takes a little bit more.
* [dynamic-component.service.ts](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/dynamic-components.service.ts) - This service is responsible for dynamically loading and opening components, keeping track of what components are open, closing components, and reloading components.
* [hmr-module-helper.ts](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/hmr-module-helper.ts). Each module that is going to be dynamically loaded will use this helper class to enable HMR for that module.  This also wires things up with the DynamicComponentService to destroy and reload the components when the module is hot-reloaded. Here's how this is used in [a module](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/lazy-components/a/a.module.ts):
 
      export class AModule {
        constructor(moduleRef: NgModuleRef<AModule>) {
          HmrModuleHelper.enableHmrDynamicNgModule(module, moduleRef);
        }
      }
      
      HmrModuleHelper.enableHmrNodeModule(module); 
 
## Instructions
Besides the above files, there are a few other things to point out:
* You'll need to list each module that you want to dynamically load in the `lazyModules` setting of your [angular.json](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/angular.json) file:
 
      "lazyModules": [
        "src/app/lazy-components/a/a.module",
        "src/app/lazy-components/b/b.module"
      ]

* You'll need to enable hmr in `serve` section of your [angular.json](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/angular.json) file:

      "options": {
        "browserTarget": "demo:build",
        "hmr": true,
        "hmrWarning": false
      },
 
* Setup your environments files so you can detect in code if hmr is on.  Details can be found on the [Angular CLI wiki](https://github.com/angular/angular-cli/wiki/stories-configure-hmr#add-environment-for-hmr).
* If you aren't using/importing the @angular/router, you'll need to configure a provider for the `NgModuleFactoryLoader` in your [app.module.ts](https://github.com/wags1999/angular-hmr-lazy-components/blob/master/src/app/app.module.ts):

      providers:    [
        {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
        DynamicComponentsService
      ],

## Remarks
* Because the DynamicComponentsService uses the components' selectors, all of the dynamic loading works in a Prod (AOT) build.
* You can't run this example on StackBlitz, as it doesn't seem to honor the lazyModules setting in the angular.json file.
