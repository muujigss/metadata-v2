import { IDatabase } from "./IDatabase";
import { IOrganization } from "./IOrganization";
import { IUser } from "./IUser";

export type IAction = {
  id?: number;
  user_id?: number;
  item_id?: number;
  action_type?: number;
  decription?: string;
  created_date?: string;
  created_user?: number;
  updated_date?: string;
  updated_user?: number;
  databases: IDatabase;
  user: IUser;
};
