export interface ICampaignContractStruct {
  endTimestamp: number;
  beneficiary: string;
  uri: string;
}

export interface ICampaign {
  id: number;
  title?: string;
  description?: string;
  imageUri?: string;
  endTimestamp: number;
  beneficiary: string;
}
