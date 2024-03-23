import { loadGame } from "./utilities.js"

export class Alerts{
    constructor(){
        this.alert = {
            famine: false,
            overpopulation: false,
            riot: false
        }
    }

    loadActiveAlerts() {
        let gameData = loadGame()
        this.alert.famine = gameData.alerts.famine 
        this.alert.overpopulation = gameData.alerts.overpopulation 
        this.alert.riot = gameData.alerts.riot 
    }

    listActiveAlerts() {
        this.loadActiveAlerts()
        let activeAlerts = []
        for (const prop in this.alert) {
            if (this.alert[prop]) {
                activeAlerts.push(prop)
            }
        }
        return activeAlerts
    }
}