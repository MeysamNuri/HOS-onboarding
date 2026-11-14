export interface IUserOrders {
    serial: string,
    serviceType: string,
    serviceStatus: string,
    pageNumber: number,
    itemsPerPage: number,
    fromDate: string
    toDate: string,
}

export interface IOrersHstoryItems {

    name: string,
    serviceName: string,
    payment: string,
    startDate: string,
    endDate: string,
    status: string,
    remainedQuantity: string,
    buyDate: string,
    serial: string,
    link: string,
    referenceNumber: string,
    trackingNumber: string,
    orderId: string,
    packetDescription: string,
    totalCount: string,
    usedQuantity: string,
    isReserved:boolean,
    isSuccessPayment:boolean

}
export interface IUserOrderHitoryRes {
    items: IOrersHstoryItems[],
    totalCount: number,
    totalPages: number,
    skip: number,
    take: number
}
export const statusMap = {
    Active: {
        text: "فعال",
        className: "Active",
    },
    Inactive: {
        text: "غیرفعال",
        className: "Inactive",
    },
    PaymentFailed: {
        text: "پرداخت ناموفق",
        className: "PaymentFailed",
    },
    Completed: {
        text: "پایان یافته",
        className: "Completed",
    },
    Reserved: {
        text: "رزرو شده",
        className: "Reserved",
    },
};

