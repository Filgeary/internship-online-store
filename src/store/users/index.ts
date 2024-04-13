import exclude from "@src/utils/exclude";
import StoreModule from "../module";
import { InitialStateUsers, Params } from "./type";

class UsersState extends StoreModule<InitialStateUsers> {
  initState(): InitialStateUsers {
    return {
      users: [],
      waiting: false, // признак ожидания загрузки
      count: 0,
      totalCount: 0,
      newCount: 0,
      confirmCount: 0,
      rejectCount: 0,
    };
  }

  async load() {
    this.setState({
      ...this.getState(),
      users: [],
      waiting: true,
    });

    const res = await this.services.api.request({
      url: `/api/v1/users?fields=items,count,newCount,confirmCount,rejectCount`,
    });

    if (res.status === 200) {
      // Пользователи загружены успешно
      this.setState(
        {
          users: res.data.result.items,
          count: res.data.result.count,
          totalCount: res.data.result.count,
          newCount: res.data.result.newCount,
          confirmCount: res.data.result.confirmCount,
          rejectCount: res.data.result.rejectCount,
          waiting: false,
        },
        "Загружены все пользователи из АПИ"
      );
    }
  }

  async setParams(params: Params) {
    this.setState({
      ...this.getState(),
      waiting: true,
    });
    const apiParams = exclude(
      {
        limit: params.pagination?.pageSize,
        skip:
          ((params.pagination?.current || 1) - 1) *
          params.pagination?.pageSize!,
        fields: "items(*),count",
        sort: params.order === "ascend" ? params.field : `-${params.field}`,
        "search[status]": params.filters?.status?.join(","),
      },
      {
        skip: 0,
        "search[status]": "",
      }
    );

    const res = await this.services.api.request({
      url: `/api/v1/users?${new URLSearchParams(apiParams)}`,
    });

    if (res.status === 200) {
      this.setState(
        {
          ...this.getState(),
          users: res.data.result.items,
          totalCount: res.data.result.count,
          waiting: false,
        },
      );
    }
  }

  delete(id: string) {
    const user = this.getState().users?.find((user) => user._id === id);
    this.setState({
      ...this.getState(),
      users: this.getState().users?.filter((user) => user._id !== id),
      count: this.getState().count - 1,
      totalCount: this.getState().totalCount -1,
      newCount:
        user?.status === "new"
          ? this.getState().newCount - 1
          : this.getState().newCount,
      confirmCount:
        user?.status === "confirm"
          ? this.getState().confirmCount - 1
          : this.getState().confirmCount,
      rejectCount:
        user?.status === "reject"
          ? this.getState().rejectCount - 1
          : this.getState().rejectCount,
    });
  }
}

export default UsersState;
