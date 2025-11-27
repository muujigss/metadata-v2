import { IDatabase } from "./IDatabase";

export type ISector = {
  id: number;
  code: string;
  name: string;
  img_url: string;
  feature: number;
  is_active: boolean;
  created_date: string;
  created_user: string;
  updated_date: string;
  updated_user: string;
  databases: IDatabase[];
  data_count: number;
};
