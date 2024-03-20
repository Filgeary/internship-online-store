interface Options {
  _id: string,
  title: string,
  code: string,
}

export interface CustomSelectLangProps {
  option: Options,
  onSelected?: (value: string) => void,
  hovered: boolean,
  changeIndex: (index: number) => void,
  checked: boolean,
  index: number
}
