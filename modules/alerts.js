export class Alerts{
    constructor(){
        this.alert = {
            famine: false,
            overpopulation: false,
        }
    }

    listActiveAlerts() {
        let activeAlerts = []
        for (const prop in this.alert) {
            if (this.alert[prop]) {
                activeAlerts.push(prop)
            }
        }
        return activeAlerts
    }
}