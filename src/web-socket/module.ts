import Services from "@src/services";
import { ModuleNames } from "./types";

class EventModule {
  services: Services
  method: string

  constructor(services: Services, method: ModuleNames) {
    this.services = services
    this.method = method
  }

  emitAuthorizedEvent(payload: object) {
    this.services.webSocket.emitEvent(this.method, payload)
  }

  emitEvent(payload: object){
    this.services.webSocket.emitEvent(this.method, payload)
  }
}

export default EventModule