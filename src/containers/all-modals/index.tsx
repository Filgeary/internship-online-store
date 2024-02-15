import React, { useEffect, memo } from 'react';
import { useAppSelector } from '@src/hooks/use-selector';

import Basket from '@src/app/basket';
import CountToAdd from '@src/containers/count-to-add';
import CatalogModal from '@src/containers/catalog-modal';

type AllModalsProps = {
  toDisableFocus: React.RefObject<any>;
};

function AllModals({ toDisableFocus }: AllModalsProps) {
  const activeModals = useAppSelector((state) => state.modals.mapOfOpened);
  const modalsIds = Object.keys(activeModals);

  useEffect(() => {
    if (!toDisableFocus.current) return;

    toDisableFocus.current.inert = Boolean(modalsIds.length);
  }, [activeModals]);

  const modalsReducer = (name: TModalsNames) => {
    switch (name) {
      case 'basket':
        return <Basket />;
      case 'countModal':
        return <CountToAdd />;
      case 'catalogModal':
        return <CatalogModal />;
    }
  };

  return (
    <>
      {modalsIds.map((id) => (
        <React.Fragment key={id}>{modalsReducer(activeModals[id].name)}</React.Fragment>
      ))}
    </>
  );
}

export default memo(AllModals);
