import { Http, RequestOptions, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
/**
 * Class extends angular2 http in order to intercept http requests
 *
 * We need two things:
 *   1. setting global request headers
 *   2. defining global error response handlers
 *
 * Thanks to:
 *   - http://stackoverflow.com/questions/34934009/handling-401s-globally-with-angular-2
 *   - http://www.adonespitogo.com/articles/angular-2-extending-http-provider/
 *
 * Also see https://jira.dekra.de/browse/MSK-142
 */
export declare class DekraHttp extends Http {
    static globalRequestHeaders: any;
    static globalResponseErrorHandlers: Array<any>;
    static addGlobalRequestHeader(header: any): void;
    static removeGlobalRequestHeader(headerName: string): void;
    static addGlobalResponseErrorHandler(handler: any): void;
    static removeGlobalResponseErrorHandler(handler: any): void;
    constructor(backend: XHRBackend, defaultOptions: RequestOptions);
    /**
     * We only need to overwrite request method as angular http will call
     * this on each request type
     *
     * Call chain:
     *
     * 1. call from outside: dekraHttp.get(url, options)
     * 2. angular http.get now calls this method (with options now undefined and url instanceof request)
     * 3. we are calling super.request here
     */
    request(url: any, options?: any): any;
    private getRequestMethodFromRequest(request);
}
export declare const DEKRA_HTTP_PROVIDER: {
    provide: typeof Http;
    useFactory: (backend: XHRBackend, options: BaseRequestOptions) => DekraHttp;
    deps: (typeof XHRBackend | typeof BaseRequestOptions)[];
};
export declare const DEKRA_HTTP_MOCK_PROVIDER: {
    provide: typeof Http;
    useFactory: (backend: any, options: any) => DekraHttp;
    deps: (typeof BaseRequestOptions | typeof MockBackend)[];
};
