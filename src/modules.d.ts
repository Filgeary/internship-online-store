declare module 'shallowequal' {
  type Shallowequal = (obj1: object, obj2: object) => boolean
  const shallowequal: Shallowequal
  export default shallowequal
}

declare module 'lodash.debounce' {
  type Debounce = (
    callback: Function,
    time: number
  ) => Function
  const debounce: Debounce
  export default debounce
}