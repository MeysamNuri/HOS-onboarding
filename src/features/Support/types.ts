export interface IUserSendLinks {
    serial: string,
    reportType: string,
    status: string,
    search: string,
    pageNumber: number,
    itemsPerPage: number,
    sendDateFrom: string
    sendDateTo: string,
}

export interface ISendLinksItems {

    reportType: string,
    fullName: string,
    messageText: string,
    phoneNumber: string,
    sendDate: string,
    status: string,
    messageLink: string

}
export interface ISendLinksRes {
    items: ISendLinksItems[],
    totalCount: number,
    totalPages: number,
    skip: number,
    take: number
}
export const statusMap = {
    delivered: {
        text: "ارسال موفق",
        className: "delivered",
    },
    failed: {
        text: "ارسال ناموفق",
        className: "failed",
    },
  
    sent: {
        text: "فرستاده شده" ,
        className: "sent",
    },
};