import Basket from "../../app/basket";
import BasketAdd from "../../app/basket-add";
import useInit from "../../hooks/use-init";
import { memo, useState } from "react"
import useSelector from "../../hooks/use-selector";
import useStore from "../../hooks/use-store";
import CatalogModal from "../../app/catalog-modal";
import codeGenerator from "../../utils/code-generator";
import { ExtendedModulesKeys } from "../../store/types";
import CmsArticleModal from "../../cms/cms-article-modal";

function Modals() {
  const store = useStore();
  const [modals, setModals] = useState([])
  const number = codeGenerator();

  const select = useSelector(state => ({
    modals: state.modals.modals
  }));

  useInit(async () => {
    let arr = [];
    for(let key in select.modals) {
      switch(select.modals[key].name) {
        case "basket":
          arr.push(<Basket key={key} close={() => store.actions.modals.close(key)} />);
          break;
        case "addToBasket":
          arr.push(<BasketAdd key={key}
                              title={select.modals[key].initialData.title}
                              count={select.modals[key].initialData.count}
                              close={ (data) => store.actions.modals.close(key, data)} />);
          break;
        case "catalogModal":
          let module = `catalog${number()}` as ExtendedModulesKeys<'catalog'>;
          store.createModule(module, 'catalog');
          arr.push(<CatalogModal key={key}
                                 storeSlice={module}
                                 close={ (data) => {
                                  store.actions.modals.close(key, data);
                                  store.deleteModule(module);
                                } } />);
          break;
        case "cmsArticleModal":
          arr.push(<CmsArticleModal key={key}
                                    data={select.modals[key].initialData}
                                    close={(data) => store.actions.modals.close(key, data)}/>);
          break;
        default:
          break;
      }
    }

    setModals(arr)
  }, [select.modals], "modals")

  return (
    <>
      {modals}
    </>
  )
}

export default memo(Modals);
