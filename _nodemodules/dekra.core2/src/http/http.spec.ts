import {} from 'jasmine';

import {
  async,
  TestBed
} from '@angular/core/testing';

import {
  Http,
  RequestOptions,
  Request,
  Headers,
  BaseRequestOptions
} from '@angular/http';

import { MockBackend } from '@angular/http/testing';
import 'rxjs/add/operator/toPromise';

import { TestUtils } from '../utils/test-utils';

import { DekraHttp, DEKRA_HTTP_MOCK_PROVIDER } from './http';

describe('DekraHttp', () => {
  let dekraHttp;
  let mockBackend: MockBackend;

  let headers;
  let requestOptions;
  let body;

  beforeEach(() => {
    headers = new Headers({
      'Content-Type': 'text/plain'
    });
    requestOptions = new RequestOptions({ headers: headers });
    body = {some: 'param'};

    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        DEKRA_HTTP_MOCK_PROVIDER, // IMPORTANT!
        BaseRequestOptions
      ]
    });

    mockBackend = TestBed.get(MockBackend);
    dekraHttp = TestBed.get(Http); // -> will now be an instance of our class!
  });

  describe('Given a global request headers was set', () => {

    let expectDefaults = () => {
      expect(dekraHttp.request).toHaveBeenCalledTimes(1);
      let args = dekraHttp.request['calls'].mostRecent().args;
      expect(args[0] instanceof Request).toBe(true);
      expect(args[0].url).toBe('http://example.com');
      expect(args[0].headers.toJSON()['Content-Type']).toEqual(['text/plain']);
      expect(args[0].headers.toJSON().headername1).toEqual(['headervalue1']);
    };

    beforeEach(() => {
      DekraHttp.addGlobalRequestHeader({
        name: 'headername1',
        value: 'headervalue1'
      });

      spyOn(dekraHttp, 'request').and.callThrough();
      TestUtils.prepareSuccessfullHttpResponse(mockBackend);
    });

    afterEach(() => {
      DekraHttp.removeGlobalRequestHeader('headername1');
    });


    it('should append them to the request given a GET request', async(() => {
      dekraHttp.get('http://example.com', requestOptions)
      .toPromise()
      .then(() => {
        expectDefaults();
      });
    }));

    it('should append them to the request given a POST request', async(() => {
      dekraHttp.post('http://example.com', body, requestOptions)
      .toPromise()
      .then(() => {
        expectDefaults();
        let args = dekraHttp.request['calls'].mostRecent().args;
        expect(JSON.parse(args[0].getBody())).toEqual(body);
      });
    }));

    it('should append them to the request given a PUT request', async(() => {
      dekraHttp.put('http://example.com', body, requestOptions)
      .toPromise()
      .then(() => {
        expectDefaults();
        let args = dekraHttp.request['calls'].mostRecent().args;
        expect(JSON.parse(args[0].getBody())).toEqual(body);
      });
    }));

    it('should append them to the request given a DELETE request', async(() => {
      dekraHttp.delete('http://example.com', requestOptions)
      .toPromise()
      .then(() => {
        expectDefaults();
      });
    }));
  });


  describe('Given a global error response handler was set', () => {

    let globalResponseErrorHandler;
    let errorHandlerSpy;

    let addGlobalResponseErrorHandler = (method: string, doneCallback) => {
      globalResponseErrorHandler = (requestConfig, errorResponse) => {
        expect(requestConfig.method).toBe(method);
        expect(requestConfig.url).toBe('http://example.com');

        expect(errorResponse.status).toBe(401);
        expect(errorResponse.json().error).toBe(true);

        if (method === 'post' || method === 'put' || method === 'patch') {
          expect(requestConfig.body).toEqual(body);
        }

        doneCallback();
      };
      DekraHttp.addGlobalResponseErrorHandler(globalResponseErrorHandler);

      errorHandlerSpy = jasmine.createSpy('error handler spy');
      TestUtils.prepareErrorHttpResponse(mockBackend, {error: true}, 401);
    };

    afterEach(() => {
      DekraHttp.removeGlobalResponseErrorHandler(globalResponseErrorHandler);
    });


    it('should call the custom handler with the correct params given a GET request', async(() => {
      addGlobalResponseErrorHandler('get', errorHandlerSpy);
      dekraHttp.get('http://example.com', requestOptions)
      .toPromise()
      .then(() => {
        expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {});
    }));

    it('should call the custom handler with the correct params given a POST request', async(() => {
      addGlobalResponseErrorHandler('post', errorHandlerSpy);
      dekraHttp.post('http://example.com', body, requestOptions)
      .toPromise()
      .then(() => {
        expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {});
    }));

    it('should call the custom handler with the correct params given a PUT request', async(() => {
      addGlobalResponseErrorHandler('put', errorHandlerSpy);
      dekraHttp.put('http://example.com', body, requestOptions)
      .toPromise()
      .then(() => {
        expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {});
    }));

    it('should call the custom handler with the correct params given a PATCH request', async(() => {
      addGlobalResponseErrorHandler('patch', errorHandlerSpy);
      dekraHttp.patch('http://example.com', body, requestOptions)
      .toPromise()
      .then(() => {
        expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {});
    }));

    it('should call the custom handler with the correct params given a DELETE request', async(() => {
      addGlobalResponseErrorHandler('delete', errorHandlerSpy);
      dekraHttp.delete('http://example.com', requestOptions)
      .toPromise()
      .then(() => {
        expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {});
    }));
  });
});
