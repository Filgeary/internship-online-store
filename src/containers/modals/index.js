import Basket from "@src/app/basket";
import BasketAdd from "@src/app/basket-add";
import useInit from "@src/hooks/use-init";
import { memo, useState } from "react"
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import CatalogModal from "@src/app/catalog-modal";

function Modals() {
  const store = useStore();
  const [modals, setModals] = useState([])

  const select = useSelector(state => ({
    modals: state.modals.modals
  }));

  useInit(() => {
    let arr = [];
    for(let key in select.modals) {
      switch(select.modals[key].name) {
        case "basket":
          arr.push(<Basket key={key} close={(data) => store.actions.modals.close(key, data)} />);
          break;
        case "addToBasket":
          arr.push(<BasketAdd key={key}
                              title={select.modals[key].initialData.title}
                              count={select.modals[key].initialData.count}
                              close={ (data) => store.actions.modals.close(key, data)} />);
          break;
        case "catalogModal":
          arr.push(<CatalogModal key={key} close={ (data) => store.actions.modals.close(key, data)} />);
          break;
        default:
          break;
      }
    }

    setModals(arr)
  }, [select.modals])

  return (
    <>
      {modals}
    </>
  )
}

export default memo(Modals);
