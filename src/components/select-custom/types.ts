// export type ISelectCustomProps2<ValueType = any, isMultiple extends boolean = boolean> = {
//     multiple: isMultiple;
//     options: ValueType[];
//     value?: isMultiple extends true ? ValueType[] : ValueType;
//     onSearch: (text: string) => ValueType[];
//     onSelect: isMultiple extends true ? (options: ValueType[]) => void : (option: ValueType) => void;
// }

export interface Option {
  value: string;
  title: string;
}

// export type ISelectCustomProps<ValueType extends Option = any> = {
//     multiple: true;
//     options: ValueType[];
//     value?: ValueType[] | ValueType;
//     defaultValue: ValueType;
//     // onSearch: (text: string) => ValueType[];
//     onSelect: (options: ValueType[] | ValueType) => void;
//     renderOption: (item: ValueType & {isSelected?: boolean; isHover?: boolean}) => JSX.Element;
// }

// export type ISelectCustomProps<ValueType extends Option> = {
//     multiple: true;
//     options: ValueType[];
//     value?: ValueType[];
//     defaultValue: ValueType;
//     onSelect: (options: ValueType[]) => void;
//     renderOption: (item: ValueType & {isSelected?: boolean; isHover?: boolean}) => JSX.Element;
//     renderSelectedOption?: (item: ValueType) => JSX.Element;
// } | {
//     multiple: false;
//     options: ValueType[];
//     value?: ValueType;
//     defaultValue: ValueType;
//     onSelect: (option: ValueType) => void;
//     renderOption: (item: ValueType & {isSelected?: boolean; isHover?: boolean}) => JSX.Element;
//     renderSelectedOption?: (item: ValueType) => JSX.Element;
// }

type BaseProps<ValueType extends Option> = {
  options: ValueType[];
  defaultValue: ValueType;
  renderOption: (
    item: ValueType & { isSelected?: boolean; isHover?: boolean }
  ) => JSX.Element;
  renderSelectedOption?: (item: ValueType) => JSX.Element;
};

type MultipleProps<ValueType extends Option> = {
  multiple: true;
  value?: ValueType[];
  onSelect: (options: ValueType[]) => void;
};

type SingleProps<ValueType extends Option> = {
  multiple?: never;
  value?: ValueType;
  onSelect: (option: ValueType) => void;
};

export type ISelectCustomProps<ValueType extends Option> =
  BaseProps<ValueType> & (SingleProps<ValueType> | MultipleProps<ValueType>);

export type ShowDirection = "up" | "down";
