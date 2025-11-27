import { IDatabase } from "./IDatabase";
import { IUser } from "./IUser";

export type IUserDatabase = {
  id: number;
  user_id: number;
  database_id: number;
  created_date: string;
  created_user: string;
  updated_date: string;
  updated_user: string;
  user: IUser;
  database: IDatabase;
};
