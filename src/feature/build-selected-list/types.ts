
export interface OptionType {
    _id: string,
    title: string,
    code: string,
    selected: boolean
}


export interface BuildSelectedListProps {
    onSelected: (langCode: string) => void,
    filteredOptions: OptionType[],
    selectedOptionIndex: number,
    setSelectedOptionIndex: (index: number) => void,
    visible: boolean
}
