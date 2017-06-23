import { TestBed } from '@angular/core/testing';
import { Response } from '@angular/http';
/**
 * Class provides some static helper functions to use in specs
 */
export declare class TestUtils {
    static prepareSuccessfullHttpResponse(mockBackend: any, responseData?: any, headerData?: any, status?: number): void;
    static prepareErrorHttpResponse(mockBackend: any, response?: Response | any, status?: number): void;
    /**
     * Helper uses Angulars` "Testbed.configureTestingModule(any)" in order to
     * configure an ionic component together with all needed ionic class mocks
     * and automatic change detection
     *
     * Please read:
     *   * https://angular.io/docs/ts/latest/guide/testing.html
     *   * http://lathonez.com/2017/ionic-2-unit-testing/
     */
    static configureIonicTestingModule(components: Array<any>): typeof TestBed;
    /**
     * Helper to compile and create a component using angulars` Testbed
     */
    static createComponent(component: any): Promise<any>;
}
