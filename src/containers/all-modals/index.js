import { useEffect } from "react";
import { useSelector } from "react-redux";

import PropTypes from 'prop-types';

import Basket from "@src/app/basket";
import CountToAdd from "@src/containers/count-to-add";

function AllModals({ toDisableFocus }) {
  const activeModal = useSelector(state => state.modals.name);

  useEffect(() => {
    if (!toDisableFocus.current) return;

    toDisableFocus.current.inert = Boolean(activeModal);
  }, [activeModal]);

  return (
    <>
      {activeModal === 'basket' && <Basket />}
      {activeModal === 'countToAdd' && <CountToAdd />}
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
