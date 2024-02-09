export interface IObjectSrc {
    limit?: number
    skip?: number
    fields?: string
    sort?: string
    "search[query]"?: string
    "search[category]"?: string
}

export interface IObjectExc extends IObjectSrc{

}