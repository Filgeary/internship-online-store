import { createContext } from "react";
import Services from "./services";
import config from "./config";

export const ServicesContext = createContext<Services>(new Services(config));
