import {Injectable} from '@angular/core';
import {
  Http,
} from '@angular/http';

import 'rxjs/add/operator/toPromise';

/**
 * Class implements a simple http buffer in order to queue up failed http
 * requests and retry them at a later time
 */
@Injectable()
export class HttpBuffer {
  private bufferedRequests: Array<any> = [];

  constructor(private http: Http) {
  }

  public append(requestConfig) {
    this.bufferedRequests.push(requestConfig);
  }

  public retryAll(): Promise<any> {
    let requestPromises = [];

    this.bufferedRequests.forEach((bufferedRequest) => {
      requestPromises.push(this.retryHttpRequest(bufferedRequest));
    });

    let requestsPromise = Promise.all(requestPromises);

    this.bufferedRequests = [];

    return requestsPromise;
  }

  // TODO discuss if clearing the buffered requests is enough
  // TODO: cancel running requests?
  public rejectAll(/*reason: string*/): void {
    this.bufferedRequests = [];
  }

  public isEmpty(): boolean {
    return this.bufferedRequests.length === 0;
  }

  private retryHttpRequest(requestConfig): Promise<any> {
    // TODO maybe we could use http.request() here:
    // https://angular.io/docs/js/latest/api/http/index/Http-class.html#!#request-anchor
    switch (requestConfig.type) {
      case 'get':
        return this.http.get(requestConfig.url, requestConfig.options).toPromise();
      case 'post':
        return this.http.post(requestConfig.url, requestConfig.body, requestConfig.options).toPromise();
      case 'put':
        return this.http.put(requestConfig.url, requestConfig.body, requestConfig.options).toPromise();
      case 'delete':
        return this.http.delete(requestConfig.url, requestConfig.options).toPromise();
    }
  }
}
