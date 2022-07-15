const merge = require('../index');

describe('it works', () => {
  it('works', async () => {
    expect(merge({ a: 'a' }, { b: 'b' })).toMatchObject({ a: 'a', b: 'b' });
  });
});
