import CatalogState from "../catalog" 

/**
 * Состояние каталога модалки
 */
class CatalogModalState extends CatalogState {

     /**
   * Выделение записи по коду
   * @param id
   */
     selectItem(id) {
        this.setState({
            ...this.getState(),
          list: this.getState().list.map(item => {
            if (item._id === id) {
              // Смена выделения
              return {
                ...item,
                selectedGoods: !item.selectedGoods
              };
            } return item.selected ? {...item, selected: false} : item;
          })
        })
      }
}

export default CatalogModalState;