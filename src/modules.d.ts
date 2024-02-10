declare module 'shallowequal' {
  type Shallowequal = (obj1: object, obj2: object) => boolean
  const shallowequal: Shallowequal
  export default shallowequal
}