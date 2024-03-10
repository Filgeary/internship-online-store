type TObject<MandatoryParameter extends string> = {}

export default function FilteredCopy (array1: Record<string, unknown>[], array2: Record<string, unknown>[], filteredBy: string = '_id') {
  const filteredOptionArray = array2.map(element => element[filteredBy])
  return array1.filter(element => filteredOptionArray.includes(element[filteredBy]))
}
