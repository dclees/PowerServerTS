import { dbMongo } from './dbWriterMongo.js'

export type LatestPowerData = {

    year: number,
    month: number,
    day: number,

    hour: number,
    mins: number,
    secs: number,

    powerNow: number,
    energyToday: number
}

type Shared = {
    latestPowerData: LatestPowerData,
    dbWriter: dbMongo,
    dbUsername: string | undefined,
    dbPassword: string | undefined,
}

const latestPowerData: LatestPowerData = {
    
    year: 0,
    month: 0,
    day: 0,
    
    hour: 0,
    mins: 0,
    secs: 0,

    powerNow: -1,
    energyToday: -1,
}

export const shared : Shared = {
    latestPowerData,
    dbWriter: new dbMongo(),
    dbUsername: '',
    dbPassword: ''
}
