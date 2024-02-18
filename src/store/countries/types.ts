export interface IСountry {
    title: string
   _id: string
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
  