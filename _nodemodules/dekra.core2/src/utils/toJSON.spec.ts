import { toJSON } from './toJSON';

describe('#toJSON', () => {

  it('should return a copy of the object given no extra parameters', () => {
    let source = {key: 'value'};
    let result: any = toJSON(source);
    expect(source).toEqual(result);
    expect(source === result).toBeFalsy();
  });

  it('should exclude specified keys', () => {
    let source = {
      key: 'value',
      key2: 'value2',
      key3: 'value3'
    };
    let result: any = toJSON(source, ['key2', 'key3']);
    expect(Object.keys(result).length).toBe(1);
    expect(result.key).toBe('value');
    expect(result.key2).not.toBeDefined();
  });

  it('should exclude $$hashKey (angular1 legacy support)', () => {
    let source = {
      key: 'value',
      $$hashKey: 'foo'
    };
    let result: any = toJSON(source, ['key2', 'key3']);
    expect(Object.keys(result).length).toBe(1);
    expect(result.$$hashKey).not.toBeDefined();
  });


  it('should exclude falsy values by default', () => {
    let source = {
      key: 'value',
      key2: null,
      key3: 0,
      key4: undefined
    };
    let result: any = toJSON(source);
    expect(Object.keys(result).length).toBe(1);
    expect(result.key).toBe('value');
    expect(result.key2).not.toBeDefined();
    expect(result.key3).not.toBeDefined();
    expect(result.key4).not.toBeDefined();
  });

  it('should not exclude falsy values if compact=false', () => {
    let source = {
      key: 'value',
      key2: null,
      key3: 0,
      key4: undefined
    };
    let result: any = toJSON(source, [], [], false);
    expect(Object.keys(result).length).toBe(4);
    expect(result.key).toBe('value');
    expect(result.key2).toBe(null);
    expect(result.key3).toBe(0);
    expect(result.key4).toBe(undefined);
  });

  it('should support a toJSON() method of values', () => {
    let source = {
      key: 'value',
      key2: {toJSON: () => { return 'foo'; }},
    };
    let result: any = toJSON(source);
    expect(Object.keys(result).length).toBe(2);
    expect(result.key).toBe('value');
    expect(result.key2).toBe('foo');
  });
});
