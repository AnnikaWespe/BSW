import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import {
  Http,
  BaseRequestOptions,
  // Request,
  // RequestOptions
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { HttpBuffer } from './http-buffer';

describe('Http Buffer', () => {
  let httpBuffer: HttpBuffer;
  let mockedBackend;
  let httpService;

  let mockHTTPBackend = () => {
    TestBed.configureTestingModule({
      providers: [
        {provide: BaseRequestOptions, useClass: BaseRequestOptions},
        {provide: MockBackend, useClass: MockBackend},
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  };

  let prepareHttpBufferWithBufferedRequests = () => {
    httpBuffer.append({
      url: 'http://example.com/get',
      type: 'get',
      options: {}
    });
    httpBuffer.append({
      url: 'http://example.com/post',
      type: 'post',
      body: {some: 'param'},
      options: {}
    });
    httpBuffer.append({
      url: 'http://example.com/put',
      type: 'put',
      body: {some: 'param'},
      options: {}
    });
    httpBuffer.append({
      url: 'http://example.com/delete',
      type: 'delete',
      options: {}
    });
  };

  beforeEach( () => {
    mockHTTPBackend();
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpBuffer, useClass: HttpBuffer},
      ]
    });
  });

   beforeEach(inject([MockBackend, Http, HttpBuffer], (
    mockBackend: MockBackend,
    http: Http,
    _httpBuffer: HttpBuffer
  ) => {
    mockedBackend = mockBackend;
    httpService = http;
    httpBuffer = _httpBuffer;
  }));


  // TODO: refactor & add more specs as soon as we have more time
  describe('#retryAll', () => {
    let retryAllPromise;

    beforeEach(async(() => {
      prepareHttpBufferWithBufferedRequests();
      spyOn(httpService, 'get').and.callThrough();
      spyOn(httpService, 'post').and.callThrough();
      spyOn(httpService, 'put').and.callThrough();
      spyOn(httpService, 'delete').and.callThrough();
      retryAllPromise = httpBuffer.retryAll();
    }));

    it('should retry all buffered requests', async(() => {
      retryAllPromise.then(() => {
        // TODO: optimize spec
        expect(httpService.get).toHaveBeenCalledWith('http://example.com/get', jasmine.any(Object));
        expect(httpService.post).toHaveBeenCalledWith('http://example.com/post',
          jasmine.any(Object), jasmine.any(Object));
        expect(httpService.put).toHaveBeenCalledWith('http://example.com/put',
          jasmine.any(Object), jasmine.any(Object));
        expect(httpService.delete).toHaveBeenCalledWith('http://example.com/delete', jasmine.any(Object));
      });
    }));

    it('should clear all buffered requests afterwards', () => {
      expect(httpBuffer.isEmpty()).toBeTruthy();
    });
  });

  // TODO test
  // describe('#rejectAll', () => {});

  describe('#isEmpty', () => {

    it('should return true given no buffered requests', () => {
      expect(httpBuffer.isEmpty()).toBeTruthy();
    });

    it('should return false given buffered requests', () => {
      prepareHttpBufferWithBufferedRequests();
      expect(httpBuffer.isEmpty()).toBeFalsy();
    });
  });
});
