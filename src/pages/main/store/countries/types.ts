
export type country = {
  _id: string,
  title: string,
  code: string
}

export type TCountryState = {
  list: country[],
  waiting: boolean
}
