export interface Response<T> {
  data: {
    result: T
    error?: any
  },
  status: number,
  headers: Headers,
}

export type ApiConfig = {
  baseUrl: string,
  langHeader: string
}