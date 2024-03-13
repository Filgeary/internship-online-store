type ObjectWithRequiredField = {
    [key: string]: any;
};

type InputArray = ObjectWithRequiredField[];
type OutputArray = ObjectWithRequiredField[];

export function filterDuplicatesByField(
    field: string,
    array1: InputArray,
    array2: InputArray
): OutputArray {
    if (!array1.length && !array2.length) return []
    const filteredArray: OutputArray = [];

    const seenValues = new Set();

    const isDuplicate = (obj: ObjectWithRequiredField): boolean => {
        const value = obj[field];
        if (seenValues.has(value)) {
            return true;
        } else {
            seenValues.add(value);
            return false;
        }
    };

    array1.forEach((obj) => {
        if (!isDuplicate(obj)) {
            filteredArray.push(obj);
        }
    });

    array2.forEach((obj) => {
        if (!isDuplicate(obj)) {
            filteredArray.push(obj);
        }
    });

    return filteredArray;
}
