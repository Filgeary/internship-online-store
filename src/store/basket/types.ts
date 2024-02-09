import { IResult } from "../types"

export interface IBasketItem {
    _id: string
    price: number
    amount: number
  }
  
export interface ISelectedItem {
    id: string
    quantity: number
  }
  
export interface IinitState {
    list: IBasketItem[],
    sum: number,
    amount: number,
    quantity: number,
    selected: ISelectedItem[]
  }

  export interface IApiResponse {
    data: {
      result: IResult
    }
    headers: Record<string, string>
    status: number
  }