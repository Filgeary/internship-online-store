import {IIssue} from "@src/utils/simplify-errors";
import {IUser} from "./User";
import {Tree} from "@src/utils/list-to-tree";
import {IArticle} from "./IArticle";

// Общий интерфейс респонсев, будет подставлять указанный джейнерик в дату
export interface IResponses<T> {
  "status": 200 | 400,
  "data": T & ErrorData,
  "headers": Record<string, string>
}

interface ErrorData {
  "error": {
    "id": string,
    "code": string,
    "message": string
    "data": {
      "issues": IIssue[]
    }
  }
}

interface SuccessfulSessionData {
  "result": {
    "token": string
    "user": IUser
  }
}

interface SuccessfulCategoryData {
  "result": {
    "items": Tree[]
  }
}

interface SuccessfulArticlesData {
  "result": {
    "items": IArticle[]
  }
}

interface SuccessfulArticleData {
  "result": IArticle
}

export type TCategoryData = IResponses<SuccessfulCategoryData>;
export type TSessionData = IResponses<SuccessfulSessionData>;
export type TArticleData = IResponses<SuccessfulArticleData>
export type TAllData = TCategoryData | TSessionData | TArticleData
