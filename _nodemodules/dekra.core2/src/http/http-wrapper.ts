/**
 * Class wraps around "$http" from angular 1 and converts
 * its behaviour to use in angular 2 apps
 */
export class HttpToNg1Wrapper {

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
  constructor(private $http: any) {}

  public request(url: string, options: any): any {
    return {
      toPromise: () => {
        let headers;
        let searchParams;

        // IMPORTANT: options.headers needs to be "instanceof Headers":
        // https://angular.io/docs/ts/latest/api/http/index/Headers-class.html
        if (options.headers && typeof options.headers.toJSON === 'function') {
          headers = options.headers.toJSON();
        }

        // IMPORTANT: options.search needs to be "instanceof URLSearchParams":
        // https://angular.io/docs/ts/latest/api/http/index/URLSearchParams-class.html
        // We need to convert the paramsMap to a "normal" object!
        if (options.search && typeof options.search.paramsMap) {
          searchParams = {};

          options.search.paramsMap.forEach((paramsArray, searchKey) => {
            searchParams[searchKey] = paramsArray[0];
          });
        }

        return this.$http({
          url: url,
          method: options.method,
          headers: headers,
          params: searchParams,
          data: options.body
        })
        .then((response) => {
          let convertedResponse = {
            json: () => { return response.data; },
            text: () => { return response.data; },
            status: response.status
          };
          return convertedResponse;
        })
        .catch((errorResponse) => {
          let convertedResponse = {
            json: () => { return errorResponse.data; },
            text: () => { return errorResponse.data; },
            status: errorResponse.status
            // config: errorResponse.config,
            // headers: errorResponse.headers
          };
          throw convertedResponse;
        });
      }
    };
  }

  public get(url: string, options: any = {}) {
    options.method = 'get';
    return this.request(url, options);
  }

  public post(url: string, body: any, options: any = {}) {
    options.body  = body;
    options.method = 'post';
    return this.request(url, options);
  }

  public put(url: string, body: any, options: any = {}) {
    options.body  = body;
    options.method = 'put';
    return this.request(url, options);
  }

  public delete(url: string, options: any = {}) {
    options.method = 'delete';
    return this.request(url, options);
  }
}
