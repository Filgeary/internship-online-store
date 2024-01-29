import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import PropTypes from 'prop-types';

import Basket from "@src/app/basket";
import CountToAdd from "@src/containers/count-to-add";
import CatalogModal from "@src/containers/catalog-modal";

function AllModals({ toDisableFocus }) {
  const activeModals = useSelector(state => state.modals.activeModals);

  useEffect(() => {
    if (!toDisableFocus.current) return;

    toDisableFocus.current.inert = Boolean(activeModals.length);
  }, [activeModals]);

  const modalsReducer = (name) => {
    switch (name) {
      case 'basket': return <Basket />
      case 'countToAdd': return <CountToAdd />
      case 'catalogModal': return <CatalogModal />
    }
  };

  return (
    <>
      {activeModals.map((modal) => (
        <React.Fragment key={modal}>
          {modalsReducer(modal)}
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

export default AllModals;
