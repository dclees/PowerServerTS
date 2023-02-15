type LatestPowerData = {

    date : string,
    time: string,
    powerNow: number,
    energyToday: number
}

type Shared = {
    latestPowerData: LatestPowerData
}

const latestPowerData: LatestPowerData = {
    date: "",
    time: "",
    powerNow: -1,
    energyToday: -1
}

export const shared : Shared = {
    latestPowerData 
}
