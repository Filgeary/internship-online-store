import CatalogState from "../catalog";

class CatalogModalState extends CatalogState {

  initState() {
    return {
        ...super.initState(),
        selectedItems: new Set()
    };
  }

  async initParams() {
    this.setState({...this.initState()})
    await this.setParams();
  }

  async setParams(newParams) {
    await super.setParams(newParams, false);
    // Установка ожидания
    this.setState({
        ...this.getState(),
        waiting: true
      }, 'Установка ожидания для выделения товаров');
      
    const items = this.getState().list.map((item) => {
        if (this.getState().selectedItems.has(item._id)){
            return {...item, selected: true}
        }
        return item;
    })
    this.setState({
        ...this.getState(),
        list: items,
        waiting: false
      }, 'Установлены параметры выделенного каталога');
  }

  selectItem(_id) {
    let selectedItems = this.getState().selectedItems;
    const list = this.getState().list.map(listItem => {
        if (listItem._id === _id) {
            if (!listItem.selected) {
                selectedItems.add(listItem._id);
            } else {
                selectedItems.delete(_id);
            }
            return {...listItem, selected: !listItem.selected}
        }
        return listItem;
    })
    this.setState({
        ...this.getState(),
        list,
        selectedItems
    }, "Выделение товара из каталога")
  }

}

export default CatalogModalState;
