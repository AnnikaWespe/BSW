/**
 * Class implements some static promise helper methods in order to extend
 * native es6 promises when necessary
 */
export declare class PromiseUtils {
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
    static allSettled(promises: Array<Promise<any>>): Promise<any>;
}
