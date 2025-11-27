import { IClassificationCode } from "./IClassificationCode";
import { IIndicatorClassification } from "./IIndicatorsClassifications";

export type IClassification = {
  id: number;
  code: string;
  name: string;
  definition: string;
  is_confirm: boolean;
  confirmed_decree_name: string;
  confirmed_decree_num: string;
  confirmed_decree_date: string;
  confirmed_organization1: string;
  confirmed_organization2: string;
  confirmed_organization3: string;
  implemented_date: string;
  last_updated_date: string;
  is_active: boolean;
  version: string;
  classificationCode: IClassificationCode[];
  indicators: IIndicatorClassification[];
};
