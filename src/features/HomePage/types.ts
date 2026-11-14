export interface IFormTypes {
  storeName: string,
  storeSlogan: string,
  invoiceType: string,
  footerText: string,

}

export interface IPostOrder {
  Mobile: string,
  Serial: string,
  ServiceCode: string,
  PacketCode: string,
  IsSuccessPayment: true,
  IsActive: true,
  PaymentDate: string,
  PaymentData: string
}

export interface ISuccesRes {
  IsSuccess: boolean
}

export interface IGetInvoiceUserSettingRes {
  serialId: null,
  storeRegistrationLogo: null,
  invoiceTitle: null,
  businessName: null,
  invoiceFooterText: null,
  advertisingSlogan: null,
  isActive: false,
  isDeleted: false,
  created: string,
  lastModified: string

}
export interface IGetSendInvoiceRes {
  link: string
}
export interface IGetInvoiceUserSetting {
  serial: string,

}

export interface IInvoiceUserSettingSubmit {
  Serial: string,
  StoreRegistrationLogo: string,
  InvoiceTitle: string,
  BusinessName: string,
  InvoiceFooterText: string,
  AdvertisingSlogan: string
}
export interface IFormFields {
  phone: string,
  serial: string
}
