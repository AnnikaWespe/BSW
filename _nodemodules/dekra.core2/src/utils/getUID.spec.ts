import { getUID } from './getUID';

describe('#getUID', () => {

  it('should return a uuid', () => {
    // UUID validation how they are as specified in RFC4122:
    expect(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      .test(getUID())).toBeTruthy();
  });
});

