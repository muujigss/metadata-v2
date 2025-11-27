import { IOrganization } from "./IOrganization";
import { IUserDatabase } from "./IUserDatabase";

export type IUser = {
  id?: number;
  user_id?: number;
  user_level?: number;
  org_id?: number;
  firstname?: string;
  lastname?: string;
  department?: string;
  position?: string;
  password?: string;
  email?: string;
  phone_number?: string;
  mobile?: string;
  profile_img_url?: string;
  roles?: [{ id: string }];
  last_login_date?: Date;
  login_attempts?: number;
  is_active?: boolean;
  created_date?: string;
  created_user?: string;
  updated_date?: string;
  updated_user?: string;
  organization?: IOrganization;
  md_user_database?: IUserDatabase[];
  userLevel?: { id: number; name: string };
};
