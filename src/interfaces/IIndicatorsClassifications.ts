import { IClassification } from "./IClassification";
import { IIndicator } from "./IIndicators";

export type IIndicatorClassification = {
  id: number;
  indicator_id: number;
  classification_id: number;
  created_date: string;
  created_user: string;
  updated_date: string;
  updated_user: string;
  classification: IClassification;
  indicator: IIndicator;
};
