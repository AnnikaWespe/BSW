import {} from 'jasmine';

import {async} from '@angular/core/testing';

import {PromiseUtils} from './promise-utils';

describe('PromiseUtils', () => {

  describe('#allSettled', () => {

    it('should resolve even if one of the promises rejects', async(() => {
      let promises = [
        Promise.resolve(1),
        Promise.reject(new Error('2')),
        Promise.resolve(3)
      ];
      PromiseUtils.allSettled(promises)
      .then((promiseValues) => {
        expect(promiseValues.length).toBe(3);
        expect(promiseValues[0]).toBe(1);
        expect(promiseValues[1] instanceof Error).toBe(true);
        expect(promiseValues[1].message).toBe('2');
        expect(promiseValues[2]).toBe(3);
      });
    }));
  });
});
