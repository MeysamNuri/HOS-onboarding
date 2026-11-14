export interface IGetStatistics {
  activeUsersCount: number;
  viewCount: number;
  sentCount: number;
  downloadCount: number;
  shareCount: number;
  topConsumers: {
    businessName: string;
    packet: string;
    guildName: string;
    guildCode: string;
    userExperience: string;
    firstName: string;
    lastName: string;
    sentCount: number;
  }[];
  newCompanions: {
    businessName: string;
    firstName: string;
    lastName: string;
    packet: string;
  }[];
}

export type SampleDocumentType = "invoice" | "individual";

export interface IGetdIndividualMoeinSampleRes {
  link: string
}
