import { NgModuleRef, Compiler, NgModule, Type, NgZone } from "@angular/core";
import { NgModuleResolver } from "@angular/compiler";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { DynamicComponentsService } from "./dynamic-components.service";
import { appRoutes } from "./app.module";
 
/**
* This class contains common functionality that allows component modules to hot-reload in the app without reloading the whole app.
*
* ### Example
* 
 * export class MyModule {
*     constructor(moduleRef: NgModuleRef<MyModule>) {
*         HmrModuleHelper.enableHmrNgModule(module, moduleRef);
*     }
* }
*
* HmrModuleHelper.enableHmrNodeModule(module);
*
* ### Remarks
* 
 * The source code for the webpack Hot Module Replacement is available at
* https://github.com/webpack/webpack/blob/v4.9.2/lib/HotModuleReplacement.runtime.js
**/
export class HmrModuleHelper {
 
    /**
     * Call this method from your module file (but outside your module class) to enable hot-module-reload.
     * @param nodeModuleRef The module to enable HMR on.  Just pass the "module" reference from the module you're calling from.
     */
    public static enableHmrNodeModule(nodeModuleRef: NodeModule): void {
        if (environment.hmr) {
            (<any>nodeModuleRef).hot.accept();
        }
    }
 
    /**
     * Call this method from the constructor of modules that will be dynamically loaded (not through the router) to make it available for hot-reload.
     * @param nodeModuleRef The module to enable HMR on.  Just pass the "module" reference from the module you're calling from.
     * @param moduleRef An NgModuleRef that points to the Angular module to enable HMR on.
     */
    public static enableHmrDynamicNgModule<T>(nodeModuleRef: NodeModule, moduleRef: NgModuleRef<T>): void {
 
        //only add a Dispose handler if this environment supports hmr and we haven't already created a disposeHandler
        if (environment.hmr && (<any>nodeModuleRef).hot._disposeHandlers.length == 0) {
 
            let compiler = moduleRef.injector.get(Compiler);
            let dynamicComponentSvc = moduleRef.injector.get(DynamicComponentsService);
            let zone = moduleRef.injector.get(NgZone);
 
            (<any>nodeModuleRef).hot.addDisposeHandler(() => {
                try {
                    zone.run(() => {
                        //get the metadata for this module
                        let metaData: NgModule = ((compiler as any)._metadataResolver._ngModuleResolver as NgModuleResolver).resolve((<any>moduleRef)._moduleType);
 
                        //get a list of all component types that are part of this module (they should all be listed as entryComponents)
                        let componentTypes = <Array<Type<any>>>metaData.entryComponents;
 
                        //ask all components of all affected types to reload
                        dynamicComponentSvc.reloadComponents(componentTypes);
 
                        //clear the Angular cache that knows about this component, so its reloaded
                        for (let declarations of metaData.declarations) {
                            let dec = <Type<any>>declarations;
                            compiler.clearCacheFor(dec);
                        }

                        compiler.clearCacheFor((<any>moduleRef)._moduleType);
                    });
 
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            });
        }
    }
 
    /**
     * Call this method from the constructor of modules that will be lazy loaded through the router to make it available for hot-reload.
     * @param nodeModuleRef The module to enable HMR on.  Just pass the "module" reference from the module you're calling from.
     * @param moduleRef An NgModuleRef that points to the Angular module to enable HMR on.
     */
    public static enableHmrRouterNgModule<T>(nodeModuleRef: NodeModule, moduleRef: NgModuleRef<T>): void {
 
        //only add a Dispose handler if this environment supports hmr and we haven't already created a disposeHandler
        if (environment.hmr && (<any>nodeModuleRef).hot._disposeHandlers.length == 0) {
            
            let compiler = moduleRef.injector.get(Compiler);
            let zone = moduleRef.injector.get(NgZone);
            let router = moduleRef.injector.get(Router);
 
            (<any>nodeModuleRef).hot.addDisposeHandler(() => {
                try {
                    zone.run(() => {
                        //get the metadata for this module
                        let metaData: NgModule = ((compiler as any)._metadataResolver._ngModuleResolver as NgModuleResolver).resolve((<any>moduleRef)._moduleType);

                        //clear the Angular cache that knows about this component, so its reloaded
                        for (let declarations of metaData.declarations) {
                            let dec = <Type<any>>declarations;
                            compiler.clearCacheFor(dec);
                        }

                        compiler.clearCacheFor((<any>moduleRef)._moduleType);

                        //tell the router to reset its config - this causes it to purge the previously loaded module
                        router.resetConfig(appRoutes);
 
                        //tell the router to re-load the current route
                        router.navigateByUrl(router.url);
                    });
 
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            });
        }
    }
}
