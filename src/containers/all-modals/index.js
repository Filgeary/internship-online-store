import React, { useEffect, memo } from "react";
import useSelector from "@src/hooks/use-selector";

import PropTypes from 'prop-types';

import Basket from "@src/app/basket";
import CountToAdd from "@src/containers/count-to-add";
import CatalogModal from "@src/containers/catalog-modal";

function AllModals({ toDisableFocus }) {
  const activeModals = useSelector((state) => state.modals.mapOfOpened);
  const modalsIds = Object.keys(activeModals);

  useEffect(() => {
    if (!toDisableFocus.current) return;

    toDisableFocus.current.inert = Boolean(modalsIds.length);
  }, [activeModals]);

  const modalsReducer = (name) => {
    switch (name) {
      case 'basket': return <Basket />
      case 'countModal': return <CountToAdd />
      case 'catalogModal': return <CatalogModal />
    }
  };

  return (
    <>
      {modalsIds.map((id) => (
        <React.Fragment key={id}>
          {modalsReducer(activeModals[id].name)}
        </React.Fragment>
      ))}
    </>
  );
}

AllModals.propTypes = {
  toDisableFocus: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};

export default memo(AllModals);
