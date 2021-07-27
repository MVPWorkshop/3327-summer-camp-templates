import { IClassableComponent } from '../../../shared/types/util.types';

export interface ICampaignProps extends IClassableComponent {
  id: number;
  title?: string;
  description?: string;
  imageUri?: string;
  endTimestamp: number;
}
