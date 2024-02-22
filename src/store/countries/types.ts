export interface IСountry {
    title: string
   _id: string
   code: string
   selected?: boolean
  }

export interface ICountriesInitState {
    list: IСountry[]
    waiting: boolean
  }

export interface IApiResponseCountries {
    data: {
        result: {
            items: IСountry[]
        }
      }
      headers: Record<string, string>
      status: number
}
  