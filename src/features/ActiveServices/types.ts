export interface IActiveServicesItems   {
      name: string,
      expirationDate: string,
      remainedQuantity: string,
      totalCount: string,
      packageTitle: string,
      packageDescription: string,
      serviceTitle: string,
      serviceDescription: string,
      startDate: string,
      endDate: string,
      durationDays: string,
      remainingDays:string,
      isReserved:boolean,
      packetCode:string
    }

export interface IActiveServicesRes {
    services: IActiveServicesItems[]
}

export interface IActiveServicesPayload {
  serial: string,

}
