/**
 * Class implements some static promise helper methods in order to extend
 * native es6 promises when necessary
 */
export class PromiseUtils {

  /**
   * Custom allSettled implementation inspired by angular $q.
   *
   * Takes an array of promises and waits for all of them to resolve or reject
   * but does not care if one of them rejects, in the end it just resolves
   * with the values of the promises (resolved or rejected)
   *
   * Heavily based on https://gist.github.com/Reshetnyak/5f5a204353e24c59eacee1cd16cb9c31
   *
   * More discussion: http://stackoverflow.com/questions/30569182/promise-allsettled-in-babel-es6-implementation
   */
  public static allSettled(promises: Array<Promise<any>>): Promise<any> {
    // Wrap each promise from array with promise which
    // resolves in both cases, either resolved of rejected
    const wrap = promise => {
      return new Promise( (resolve) => {
        return promise
          .then( result => resolve( result ) )
          .catch( reason => resolve( reason ) );
      });
    };

    // Provide array of promises which can only be resolved
    return Promise.all( promises.map( wrap ) );
  }
}
