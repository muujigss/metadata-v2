"use server";
import { IUser } from "@/interfaces/IUser";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import moment from "moment";
import { cookies } from "next/headers";
import { sendMail } from "../MailService";

const getUserModel = async (user_level: number, org_id: number) => {
  try {
    let whereObj = {};
    // console.log("whereobj", whereObj);
    
    if (user_level == 1) {
      whereObj = {};
    } else {
      whereObj = {
        org_id,
      };
    }

    const users = await prisma.md_users.findMany({
      where: {
        ...whereObj,
      },
      select: {
        id: true,
        org_id: true,
        user_level: true,
        firstname: true,
        lastname: true,
        email: true,
        phone_number: true,
        mobile: true,
        department: true,
        position: true,
        roles: true,
        userLevel: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
        is_active: true,
      },
    });

    return users;
  } catch (error) {
    // console.error("Error in getUserModel:", error);
    throw new Error("Failed to getUserModel");
  }
};
const loginUserModel = async (email: string, password: string) => {
  try {
    const user = await prisma.md_users.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        roles: true,
        password: true,
        email: true,
        firstname: true,
        lastname: true,
        user_level: true,
        org_id: true,
        position: true,

        md_user_database: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    // if (user?.id) {
    //   const psResult = await bcrypt.compare(password, user?.password || "");

    //   if (!psResult) {
    //     return null;
    //   }
    // }
    // const userLogin = await prisma.md_users.update({
    //   where: {
    //     id: user?.id,
    //   },
    //   data: {
    //     last_login_date: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    //   },
    // });

    return user;
  } catch (error) {
    console.error("Error in loginUserModel:", error);
    throw new Error("Failed to loginUserModel");
  }
};
/* Function to generate combination of password */
function generatePassword() {
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

const createUserModel = async (data: IUser) => {
  const {
    id,
    user_id,
    user_level,
    org_id,
    firstname,
    lastname,
    email,
    roles,
    last_login_date,
    position,
    department,
    phone_number,
    mobile,
    profile_img_url,
    is_active,
    md_user_database,
  } = data;
  let user = {};
  try {
    const cookieStore = cookies();
    const create_user_id = cookieStore.get("user_id")?.value;
    const now = new Date();
    const created_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();
    const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();
    const userRoles = roles?.map((item: any) => {
      return { id: item.toString() };
    });
    if (!user_id) {
      const userCheck = await prisma.md_users.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (userCheck?.id) {
        return {
          status: false,
          message: `${email} Имэйл хаягтай хэрэглэгч бүртгэлтэй байна.`,
        };
      }

      let password = generatePassword();

      const ps = await bcrypt.hash(password, 10);
      user = await prisma.md_users.create({
        data: {
          org_id: org_id || 0,
          user_level: user_level || 0,
          firstname,
          lastname,
          email,
          roles: userRoles,
          last_login_date:
            last_login_date || moment(now).format("YYYY-MM-DDTHH:mm:ssZ"),
          position,
          department,
          phone_number,
          mobile,
          profile_img_url,
          password: ps,
          is_active,
          login_attempts: 0,
          created_user: Number(create_user_id),
          updated_user: Number(create_user_id),
          created_date,
          updated_date,
        },
      });

      let dbs: any = [];
      md_user_database &&
        md_user_database?.length > 0 &&
        md_user_database?.forEach(async (item: any) => {
          dbs.push({
            user_id: user.id,
            database_id: item,
            created_date,
            created_user: Number(user_id),
          });
        });

      const userDatabase = await prisma.md_user_database.createMany({
        data: dbs,
      });

      // send passwor to email

      const to = email;
      const subject = "Тавтай морил";
      const html = `Сайн байна уу, <br/><br/> Төрийн мета өгөгдлийн нэгдсэн санд хандах эрхийг илгээж байна. <br/><br/> Таны нэвтрэх нэр: <b>${email}</b> <br/><br/> Таны нууц үг:<b>${password}</b> <br/><br/> Хандах холбоос:  <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/><br/> Баярлалаа`;

      const mail = await sendMail({ to, subject, html });
    } else {
      user = await prisma.md_users.update({
        where: {
          id: user_id,
        },
        data: {
          user_level: user_level || 0,
          firstname,
          lastname,
          email,
          roles: userRoles,
          position,
          department,
          phone_number,
          mobile,
          profile_img_url,
          is_active,
          updated_user: Number(create_user_id),
          updated_date,
        },
      });

      let dbs: any = [];

      const deleteDB = await prisma.md_user_database.deleteMany({
        where: {
          user_id: user_id,
        },
      });
      if (deleteDB) {
        md_user_database &&
          md_user_database?.length > 0 &&
          md_user_database?.forEach(async (item: any) => {
            dbs.push({
              user_id: user.id,
              database_id: item,
              created_date,
              created_user: Number(user_id),
            });
          });

        const userDatabase = await prisma.md_user_database.createMany({
          data: dbs,
        });
      }
    }

    return { user, status: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error in createUserModel:", error);
    throw new Error("Failed to createUserModel");
  }
};

const getUserInfoModel = async (user_id: number) => {
  try {
    const data = await prisma.md_users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        org_id: true,
        user_level: true,
        userLevel: {
          select: {
            id: true,
            name: true,
          },
        },
        lastname: true,
        firstname: true,
        phone_number: true,
        mobile: true,
        email: true,
        roles: true,
        position: true,
        department: true,
        profile_img_url: true,
        organization: {
          select: {
            name: true,
          },
        },
        md_user_database: {
          select: {
            id: true,
            user_id: true,
            database_id: true,
            database: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error in getUserInfoModel:", error);
    throw new Error("Failed to fetch getUserInfoModel");
  }
};
const getUserInfoByLevelModel = async (user_level: number) => {
  try {
    const data = await prisma.md_users.findFirst({
      where: {
        user_level: user_level,
      },
      select: {
        id: true,
        firstname: true,
        email: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error in getUserInfoByLevelModel:", error);
    throw new Error("Failed to fetch getUserInfoByLevelModel");
  }
};

const updatePasswordModel = async (data: any) => {
  const { id, oldPassword, newPassword } = data;

  let user = {};
  try {
    const cookieStore = cookies();
    const create_user_id = cookieStore.get("user_id")?.value;
    const now = new Date();

    const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();

    if (id) {
      const userCheck = await prisma.md_users.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          password: true,
        },
      });

      if (userCheck?.id) {
        if (userCheck?.id > 44) {
          const ps = await bcrypt.hash(newPassword, 10);
          user = await prisma.md_users.update({
            where: {
              id,
            },
            data: {
              password: ps,
              updated_user: Number(create_user_id),
              updated_date,
            },
          });
        } else {
          const ps = await bcrypt.compare(
            oldPassword,
            userCheck?.password || ""
          );

          if (ps) {
            const ps = await bcrypt.hash(newPassword, 10);
            user = await prisma.md_users.update({
              where: {
                id,
              },
              data: {
                password: ps,
                updated_user: Number(create_user_id),
                updated_date,
              },
            });
            return {
              status: true,
              user,
            };
          }
        }
      } else {
        return {
          status: false,
          message: `Хуучин нууц үг буруу байна.`,
        };
      }
    }

    //return { user, status: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error in updatePasswordModel:", error);
    throw new Error("Failed to updatePasswordModel");
  }
};
const forgotPasswordModel = async (email: any) => {
  let user = {};
  try {
    const now = new Date();
    const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();

    if (email) {
      const userCheck = await prisma.md_users.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      let newPassword = generatePassword();

      if (userCheck?.id) {
        if (newPassword) {
          const ps = await bcrypt.hash(newPassword, 10);
          user = await prisma.md_users.update({
            where: {
              id: userCheck?.id,
            },
            data: {
              password: ps,
              // updated_user: Number(create_user_id),
              updated_date,
            },
          });
          // send passwor to email

          const to = email;
          const subject = "Нууц үг сэргээх";
          const html = `Сайн байна уу, <br/><br/> Төрийн мета өгөгдлийн нэгдсэн санд хандах эрхийг илгээж байна. <br/><br/> Таны нэвтрэх нэр: <b>${email}</b> <br/><br/> Таны нууц үг:<b>${newPassword}</b> <br/><br/> Хандах холбоос:  <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/><br/> Баярлалаа`;
          const mail = await sendMail({ to, subject, html });

          return {
            status: true,
            user,
          };
        }
      } else {
        return {
          status: false,
          message: `Таны имэйл хаяг буруу эсвэл бүртгэлгүй байна.`,
        };
      }
    }
  } catch (error) {
    console.error("Error in createUserModel:", error);
    throw new Error("Failed to forgotPasswordModel");
  }
};

const deleteUserInfoModel = async (user_id: number) => {
  try {
    const data = await prisma.md_users.delete({
      where: {
        id: user_id,
      },
    });

    return data;
  } catch (error) {
    console.error("Error in deleteUserInfoModel:", error);
    throw new Error("Failed to fetch deleteUserInfoModel");
  }
};

export {
  createUserModel,
  deleteUserInfoModel,
  forgotPasswordModel,
  getUserInfoByLevelModel,
  getUserInfoModel,
  getUserModel,
  loginUserModel,
  updatePasswordModel,
};
