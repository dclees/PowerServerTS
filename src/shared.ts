type LatestPowerData = {

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
    latestPowerData: LatestPowerData
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
    latestPowerData 
}
