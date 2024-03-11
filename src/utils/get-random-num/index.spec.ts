import getRandomNum from '.';

describe('getRandomNum', () => {
  test('test1', () => {
    const res = getRandomNum(0, 10);

    expect(res).toBeGreaterThanOrEqual(0);
    expect(res).toBeLessThanOrEqual(10);
  });
});
