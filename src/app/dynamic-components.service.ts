import { NgModuleFactoryLoader, Injector, ViewContainerRef, ComponentFactoryResolver, Type, Injectable, ComponentRef, ElementRef } from "@angular/core";
import { ComponentSelectors } from "./component-selectors";

@Injectable()
export class DynamicComponentsService {

    constructor(
        private loader: NgModuleFactoryLoader,
        private injector: Injector
    ) { }

    /** 
     * This map keeps track of the components that are open.  
     * This is important to be able to reload components when their modules are hot-reloaded.
     */
    private openComponents = new Map<ComponentRef<any>, CreateComponentRequest>();

    /**
     * Dynamically create an Angular component using an NgModuleFactoryLoader
     * @param request Contains the info required to dynamically load an Angular component
     */
    public createComponent(request: CreateComponentRequest): Promise<void> {
        return this.loader
            .load(request.modulePath)
            .then((moduleFactory) => {
                const module = moduleFactory.create(this.injector);
                const componentFactoryResolver = module.componentFactoryResolver;
                const factoryClass = this.getFactoryClass(componentFactoryResolver, request.selectorName);
                if (!factoryClass) throw new Error(`Unrecognized component name: ${request.selectorName}`);
                const componentFactory = componentFactoryResolver.resolveComponentFactory(factoryClass);
                const componentRef = request.outlet.createComponent(componentFactory, request.index, module.injector);
                this.openComponents.set(componentRef, request);
            })
            .catch(err => {
                throw err;
            });
    }

    /**
    * Given an ComponentFactoryResolver, returns the Type that has the given selector.  
    * We use selectors to find the component because those don't get changed during optimization/minification
    * @param componentFactoryResolver A ComponentFactoryResolver for a given module
    * @param selector The selector to find
    */
    private getFactoryClass(componentFactoryResolver: ComponentFactoryResolver, selector: string): Type<any> {
        const factories = Array.from(componentFactoryResolver['_factories'].keys());
        const factoryClass = <Type<any>>factories.find((x: any) => componentFactoryResolver['_factories'].get(x).selector === selector);
        return factoryClass;
    }

    /**
     * Finds all open components of a specific type, and reloads them. This is used in the HMR process.
     * @param componentTypes The type of component to reload.
     */
    public reloadComponents(componentTypes: Array<Type<any>>) {
        //get an array of componentRefs that should be reloaded
        let componentsToReload = Array.from(this.openComponents.keys()).
                                filter(c => componentTypes.some(t => c.instance instanceof t));
        let reloadRequests = new Array<CreateComponentRequest>();

        //build the list of reload requests
        for (let componentToReload of componentsToReload) {
            let request = this.openComponents.get(componentToReload);
            //find out what the current index of the component is in the view
            request.index = request.outlet.indexOf(componentToReload.hostView);
            reloadRequests.push(request);
        }

        //close and re-load the components
        componentsToReload.forEach(c => this.closeComponentRef(c));
        reloadRequests.forEach(r => this.createComponent(r));
    }

    /**
     * Destroy/close the component passed in
     * @param component The component to destroy/close
     */
    public closeComponent(component: any) {
        let componentRef = Array.from(this.openComponents.keys()).find(c => c.instance === component);
        this.closeComponentRef(componentRef);
    }

    /**
     * Destroy/close the componentRef passed in
     * @param componentRef The componentRef to destroy/close
     */
    protected closeComponentRef(componentRef: ComponentRef<any>) {
        componentRef.destroy();
        this.openComponents.delete(componentRef);
    }
}

export interface CreateComponentRequest {
    modulePath: string;
    selectorName: ComponentSelectors;
    outlet: ViewContainerRef;
    index?: number;
}
