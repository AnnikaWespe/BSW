import {
  async
} from '@angular/core/testing';

import {
  Headers,
  URLSearchParams
} from '@angular/http';

import { HttpToNg1Wrapper } from './http-wrapper';

describe('HttpToNg1Wrapper', () => {
  let $httpFake;
  let httpWrapper: HttpToNg1Wrapper;
  let fakeResponse;
  let options;

  beforeEach(() => {
    fakeResponse = {status: 200, data: 'data from server'};

    let headers = new Headers({foo: 'bar'});
    spyOn(headers, 'toJSON').and.callThrough();

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.set('foo', '2');
    urlSearchParams.set('bar', '3');

    options = {
      method: 'get',
      headers: headers,
      search: urlSearchParams,
      body: 'data'
    };
  });


  describe('#request', () => {
    // NOTE: this spec tests all at once. could be optimized...

    function executeExpectations(convertedResponse) {
      expect(options.headers.toJSON).toHaveBeenCalled(); // sebastian: 😘

      expect($httpFake).toHaveBeenCalledWith({
        url: 'the-url',
        method: options.method,
        headers: options.headers.toJSON(),
        params: {foo: '2', bar: '3'},
        data: options.body
      });
      expect(convertedResponse.json()).toEqual(fakeResponse.data);
      expect(convertedResponse.text()).toEqual(fakeResponse.data);
      expect(convertedResponse.status).toEqual(fakeResponse.status);
    }

    describe('given angular-1 $http resolves', () => {

      it('should call angular-1 $http correctly and resolve with a converted ' +
      'reponse to use in angular-2 apps', async(() => {
        $httpFake = jasmine.createSpy('angular-1 $http spy')
          .and.returnValue(Promise.resolve(fakeResponse));
        httpWrapper = new HttpToNg1Wrapper($httpFake);

        httpWrapper.request('the-url', options)
        .toPromise()
        .then((convertedResponse) => {
          executeExpectations(convertedResponse);
        });
      }));
    });

    describe('given angular-1 $http rejects', () => {

      it('should call angular-1 $http correctly and reject with a converted ' +
      'reponse to use in angular-2 apps', async(() => {
        $httpFake = jasmine.createSpy('angular-1 $http spy')
          .and.returnValue(Promise.reject(fakeResponse));
        httpWrapper = new HttpToNg1Wrapper($httpFake);

        httpWrapper.request('the-url', options)
        .toPromise()
        .catch((convertedResponse) => {
          executeExpectations(convertedResponse);
        });
      }));
    });
  });

  describe('#get', () => {

    it('should execute "#request()" correctly', () => {
      httpWrapper = new HttpToNg1Wrapper($httpFake);
      spyOn(httpWrapper, 'request');
      options.method = 'get';
      httpWrapper.get('the url', options);
      expect(httpWrapper.request).toHaveBeenCalledWith('the url', options);
    });
  });

  describe('#post', () => {

    it('should execute "#request()" correctly', () => {
      httpWrapper = new HttpToNg1Wrapper($httpFake);
      spyOn(httpWrapper, 'request');
      let body = 'body';
      options.method = 'post';
      options.body = body;
      httpWrapper.post('the url', body, options);
      expect(httpWrapper.request).toHaveBeenCalledWith('the url', options);
    });
  });

  describe('#put', () => {

    it('should execute "#request()" correctly', () => {
      httpWrapper = new HttpToNg1Wrapper($httpFake);
      spyOn(httpWrapper, 'request');
      let body = 'body';
      options.method = 'put';
      options.body = body;
      httpWrapper.put('the url', body, options);
      expect(httpWrapper.request).toHaveBeenCalledWith('the url', options);
    });
  });

  describe('#delete', () => {

    it('should execute "#request()" correctly', () => {
      httpWrapper = new HttpToNg1Wrapper($httpFake);
      spyOn(httpWrapper, 'request');
      options.method = 'delete';
      httpWrapper.delete('the url', options);
      expect(httpWrapper.request).toHaveBeenCalledWith('the url', options);
    });
  });
});
