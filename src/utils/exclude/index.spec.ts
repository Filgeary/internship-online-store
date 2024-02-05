import exclude from './index.js';

describe('utils/exclude', () => {

  test('empty exclude', () => {
    expect(exclude({a: 1, b: 2}, {})).toEqual({a: 1, b: 2});
  });

  test('equal one property', () => {
    expect(exclude({a: 1, b: 2}, {b: 2})).toEqual({a: 1});
  });

  test('all equals', () => {
    expect(exclude({a: 1, b: 2}, {b: 2, a: 1})).toEqual(undefined);
  });

  test('deep', () => {
    const s = {a: 1, b: 2, c: {n1: 10, n2: {y: 1, x: 9}}};
    expect(exclude(s, {})).toEqual(s);
    expect(exclude(s, {b: 2, c: {n2: {x: 9}}})).toEqual({a: 1, c: {n1: 10, n2: {y: 1}}});
    expect(exclude(s, {b: 2, c: {n2: {y: 1, x: 9}}})).toEqual({a: 1, c: {n1: 10}});
  });
});

