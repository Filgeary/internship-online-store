import Services from "../services"

class ServiceServer {
    services: Services
    promisesArray: Promise<any>[] = []

    constructor(services: Services,) {
        this.services = services
    }

    addPromise(promise: Promise<any>) {
        console.log('promise', promise)
        this.promisesArray.push(promise)
    }

    async awaitPromises() {
        console.log('this.promisesArray', this.promisesArray)
        try {
            await Promise.all(this.promisesArray);
            // Все промисы успешно завершились
            console.log("All promises resolved successfully");
        } catch (error) {
            // Один из промисов был отклонён
            console.error("One or more promises were rejected:", error);
            throw error; // Можно выбросить ошибку дальше для обработки в вызывающем коде
        }
    }
}

export default ServiceServer