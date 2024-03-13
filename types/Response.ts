import {IIssue} from "@src/ww-old-utils-postponed/simplify-errors";
import {Tree} from "@src/ww-old-utils-postponed/list-to-tree";

// Общий интерфейс респонсев, будет подставлять указанный джейнерик в дату
interface IResponses<T> {
  "status": 200 | 400,
  "data": T & ErrorData,
  "headers": Record<string, string>
}

// Ошибка с сервера
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

// Успешная сессия
interface SuccessfulSessionData {
  "result": {
    "token": string
    "user": IUser
  }
}

// Успешная загрузка категорий
interface SuccessfulCategoryData {
  "result": {
    "items": Tree[]
  }
}

// Успешная загрузка товаров
interface SuccessfulArticleData {
  "result": IArticle
}

declare type TCategoryData = IResponses<SuccessfulCategoryData>;
declare type TSessionData = IResponses<SuccessfulSessionData>;
declare type TArticleData = IResponses<SuccessfulArticleData>
