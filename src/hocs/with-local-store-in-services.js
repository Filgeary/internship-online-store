import { ServicesContext } from "@src/context";
import useServices from "@src/hooks/use-services";
import { useLayoutEffect, useMemo } from "react";

const withLocalStoreInServices = (Component, localModules) => (props) => {

  const globalServices = useServices();
  
  const {localServices, unsubscribe} = useMemo(() => {
    const {localServices, unsubscribe} = globalServices.dublicateServicesWithLocalStore(localModules)    
    return {localServices, unsubscribe}
  }, [])

  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return (
    <ServicesContext.Provider value={localServices}>
      <Component {...props} />;
    </ServicesContext.Provider>
  )
}

export default withLocalStoreInServices
