/**
 * Class wraps around "$http" from angular 1 and converts
 * its behaviour to use in angular 2 apps
 */
export declare class HttpToNg1Wrapper {
    private $http;
    /**
     * This class will be used in angular-1 apps like so:
     *
     * angular.service('HttpToNg1Wrapper', [
     *  '$http', window.dekra2.HttpToNg1Wrapper
     * ]);
     *
     * which makes sure that this class will be instantiated by angular-1
     * with the correct $http instance.
     */
    constructor($http: any);
    request(url: string, options: any): any;
    get(url: string, options?: any): any;
    post(url: string, body: any, options?: any): any;
    put(url: string, body: any, options?: any): any;
    delete(url: string, options?: any): any;
}
