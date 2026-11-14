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
export interface IDetails {
    channel: string,
    checkSmsDeliveryResult: boolean,
    createDate: string,
    messageId: string
    providerStatus: boolean,
    status: string
}
export interface ISendLinksItems {
    details: IDetails[]
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
    Read: {
        text: "مشاهده شده",
        className: "Read",
    },
     sent: {
        text: "ارسال موفق",
        className: "sent",
    },
     failed: {
        text: "ارسال ناموفق",
        className: "message-failed",
    },
    UnRead: {
        text: "مشاهده نشده",
        className: "UnRead",
    },

};
