import { parse } from './parse';

describe('#parse', () => {

  it('should return the value of the given object path string', () => {
    let getter = parse('some');
    expect(getter({some: 42})).toEqual(42);

    getter = parse('some.path');
    expect(getter({some: {path: 42}})).toEqual(42);

    getter = parse('some.path.and.even.more');
    expect(getter({some: {path: {and: {even: {more: 42}}}}})).toEqual(42);
  });

  it('should return null given the path does not exist', () => {
    let getter = parse('some.path.and.not_found.more');
    expect(getter({some: {path: {and: {even: {more: 42}}}}})).toEqual(null);
  });
});
