import {useContext} from "react";
import {ServicesContext} from "../context";
import Services from "../services";

/**
 * Хук для доступа к сервисам
 * @return {Services}
 */
export default function useServices(): Services {
  return useContext(ServicesContext);
}
