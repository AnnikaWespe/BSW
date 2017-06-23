import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
/**
 * Class implements a simple http buffer in order to queue up failed http
 * requests and retry them at a later time
 */
export declare class HttpBuffer {
    private http;
    private bufferedRequests;
    constructor(http: Http);
    append(requestConfig: any): void;
    retryAll(): Promise<any>;
    rejectAll(): void;
    isEmpty(): boolean;
    private retryHttpRequest(requestConfig);
}
