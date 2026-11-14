import type { ReactNode } from "react"
export interface ILogout {
  link: string
}

export interface IServicePacketOBG {
  serviceId: number,
  code: string,
  name: string,
  salesPrice: number,
  basePrice: number,
  usageCount: number,
  duration: number,
  isActive: true,
  isItHaveAgentDiscount: boolean,
  color: string,
  description: string,
  discountPercent: string
  priority: number,
  lable: string,
  pricePerSend: number,
  sendingCosts: number,
  baseSubscriptionPrice: number,
  sendCount: number,
  type: string,
  category: string,
  featureList: [
    string
  ],

}

export interface IServicePacketRes {
  servicePacket: IServicePacketOBG[],
  agentName: string,
  defaultFilter: {
    type: string,
    category: string
  },
  isSuccess: boolean

}
export interface IServicePacket {
  serviceCode: string,
  agentCode: string,
  discountCode?: string | null,
  type?: string | null,
  category?: string | null
}

export interface OrderModalProps {
  onCancel: () => void;
  isFromNavbar?: boolean;
  handleSelectedSerial?: (value: string) => void,
  onSubmit?: (values: { phone: string; serial: string }) => void | Promise<void>;
  isSubmitting?: boolean;
  serviceCode?: string;
  packetCode?: string

}
export interface IDiscountProps {
  onCancel: () => void;

}

export interface BottomModalProps {
  fitContent?: boolean;
  open: boolean;
  onClose: () => void;
  height?: string; // مثال: "5numbervh"
  children: ReactNode;
  showHandler?: boolean,
  width?: string,
  modalTitle?:string
}

export interface IHolooServicesPlans {
  path: string
  packetsList?: IServicePacketOBG[] | undefined,
  agentCode?: boolean
}
export interface IPlansProps {
  path: string,
  handleOpenModal?: (value: any) => void,
  handleInvoiceDemoModal?: () => void,
}
export interface InvoiceDemoModalProps {
  onCancel: () => void;
  onSubmit?: (values: { phone: string; serial: string }) => void;
  sampleType?: "invoice" | "individual";
}
export const durationMap: Record<number, string> = {
  1: "یک ماهه",
  2: "دو ماهه",
  3: "سه ماهه",
  4: "چهار ماهه",
  5: "پنج ماهه",
  6: "شش ماهه",
};
export interface IPostOrder {
  Mobile: string,
  Serial: string,
  ServiceCode: string,
  PacketCode: string,
  IsSuccessPayment: boolean,
  AgentCode: string,
  DiscountCode: string,
  Campaign: string,
  Source: string,
  Media: string,
}
export interface IUserPlans {
  phoneNumber: string,
  serial: string,
  serviceCode: string,
  packetCode: string,
  agentCode: string,
  discountCode: string

}
export interface IPostOrderRes {
  isSuccess: boolean,
  paymentUrl: string,
  orderId: string,
  renewUrl: string,
  expirationDate: string
}
export interface IToken {
  Code: string
}
export interface IValidationToken {
  Token: string
}
export interface ITokenRes {
  accessToken: string,
  IsSuccess: boolean
}
export interface IProposePackage {
  SendCount: number,
  MonthCount: number,
  FieldOfActivity: string,
  Mobile: string,
  Serial: string,
  Description: string,
  ServiceCode: string
}
export interface IProposePackageRes {
  isSuccess: boolean
}
export interface IValidationTokenRes {
  active: boolean,
  isSuccess: boolean
}

export interface IPaymentData {
  PaymentDate: string | Date,
  IsSucessPayment: boolean,
  PaymentData: string,
  Id: string
}
export interface IPaymentDataRes {
  isSuccess: boolean,
  title: string,

}
export interface IFormTypes {
  storeName: string,
  storeSlogan: string,
  invoiceType: string,
  footerText: string,
  isAllowedToShowRemain:boolean

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
  lastModified: string,
  invoiceType: string,
  isAllowedToShowRemain:boolean

}
export interface IGetInvoiceUserSetting {
  serial: string,

}
export interface IGActiveUserSerials {
  serials: string[]
}

export interface IInvoiceUserSettingSubmit {
  Serial: string,
  StoreRegistrationLogo: string,
  InvoiceTitle: string,
  BusinessName: string,
  InvoiceFooterText: string,
  AdvertisingSlogan: string,
  InvoiceType: string,
  IsAllowedToShowRemain:boolean
}
export interface ISuccesRes {
  IsSuccess: boolean
}
export interface IGetUser {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  serials: string[],
  userName: string
}


export interface IGetOrder {

  OrderId: string
}
export interface IGetOrderOBJ {
  orderId: string,
  serial: string,
  isActive: true,
  service: string,
  packetName: string,
  packetSalesPrice: number,
  packetUsageCount: number,
  packetDuration: number,
  isSuccessPayment: true,
  paymentDate: string,
  usedQuantity: number,
  usageCount: number,
  paymentData: string,
  onboardDate: string,
  remainQuantity: number,
  remainDays?: number,
  discountPrice?: number,
  isReserved?: boolean,
  currentService?: {
    name?: string,
    packetName?: string,
    remainQuantity?: number,
    usageCount?: number,
    remainDays?: number,
  } | null,
  fromDate: string,
  toDate: string
}
export interface IGetOrderRes {
  orders: IGetOrderOBJ[]
  isSuccess: boolean
}
 

export const statusMapping = {
  Active: "فعال",
  Inactive: "غیرفعال",
  Completed: "پایان یافته",
  PaymentFailed: "پرداخت ناموفق",
  Reserved: "رزرو شده",
};
export const sentLinksstatusMapping = {
  UnRead: "مشاهده نشده",
  Read: "مشاهده شده",

};
export const serviceTypeMapping = {
  AI: "دستیار تحلیل هلو",
  BI: "هلو همراه",
  SendInvoice: "اشتراک آنلاین اسناد ",
};


export const orderTypeMapping = {
  ProformaInvoice: "پیش فاکتور",
  Invoice: "فاکتور",
  IndividualMoeinReport: "حساب معین",
  CashMoeinReport: "دفتر معین",
  FinancialBalanceReport: "دفتر تفصیلی",
};

export interface PackageFilterState {
  type: string | null;
  category: string | null;
}
export const packageFilterInitial: PackageFilterState = {
  type: "",
  category: "",
};
