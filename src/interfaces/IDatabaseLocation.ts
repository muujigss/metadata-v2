import { IDatabase } from "./IDatabase";

export type IDatabaseLocation = {
  id: number;
  name: string;
  created_date: string;
  created_user: string;
  updated_date: string;
  updated_user: string;
  databases: IDatabase[];
};
