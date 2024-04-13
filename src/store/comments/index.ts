import StoreModule from "../module";
import { InitialStateComments } from "./type";

class CommentsState extends StoreModule<InitialStateComments> {
  initState(): InitialStateComments {
    return {
      comments: [],
      waiting: false,
      count: 0
    }
  }

  async load() {
    this.setState({
      ...this.getState(),
      comments: [],
      waiting: true
    })

    const res = await this.services.api.request({
      url: `/api/v1/comments?fields=items(*),count`,
    });

    if(res.status === 200) {
      this.setState({
        comments: res.data.result.items,
        count: res.data.result.count,
        waiting: false
      })
    }
  }
}

export default CommentsState;
