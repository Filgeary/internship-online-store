import CatalogState from "../catalog" 
import { IResult } from "../types"

/**
 * Состояние каталога модалки
 */
class CatalogModalState extends CatalogState {

     /**
   * Выделение записи по коду
   * @param id
   */
     selectItem(id: string) {
        this.setState({
            ...this.getState(),
          list: this.getState().list.map((item: IResult) => {
            if (item._id === id) {
              // Смена выделения
              return {
                ...item,
                selectedGoods: !item.selectedGoods
              }
            }
            // return item.selected ? {...item, selected: false} : item;
            return item
          })
        })
      }
}

export default CatalogModalState