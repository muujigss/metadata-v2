import { IDatabase } from "./IDatabase";

export type IOrganization = {
  id: number;
  name: string;
  org_short_name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  img_url: string;
  is_active: boolean;
  version: string;
  created_date: string;
  created_user: string;
  updated_date: string;
  updated_user: string;
  databases: IDatabase[];
  data_count: number;
};
