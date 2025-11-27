import { IDatabase } from "./IDatabase";
import { IIndicator } from "./IIndicators";

export type ITable = {
  id: number;
  db_id: number;
  form_id: number;
  code: string;
  name: string;
  description: string;
  source: [{ id: string }];
  source_other: string;
  security_level: [{ id: string }];
  licence_type: string;
  licence_type_other: string;
  opendata_licence_url: string;
  started_date: string;
  created_date?: string;
  created_user?: number;
  updated_date?: string;
  updated_user?: number;
  is_active: boolean;
  version: string;
  indicators?: IIndicator[];
  database?: IDatabase;
};
