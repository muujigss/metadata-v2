"use server";

import { IAction } from "@/interfaces/IAction";
import { sendMail } from "./MailService";
import { checkStatusMetadata } from "./model/DatabaseModel";
import { getUserInfoByLevelModel, getUserInfoModel } from "./model/UserModel";
import { mailTemplateDbStatusChangeUser } from "@/utils/helper-mail";

const checkValidationStatus = async (db_id: number) => {
  const checkStatus = await checkStatusMetadata(db_id);
  if (!checkStatus?.status) {
    throw new Error(checkStatus?.message);
  }
};

const updateActionService = async (data: IAction) => {
  // try {
    // await checkValidationStatus(data?.item_id);
    const checkStatus = await checkStatusMetadata(data?.item_id);
    if (!checkStatus?.status) {
      throw new Error(checkStatus?.message);
    }
    const res = await fetch(`${process.env.BASE_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    /**
     * Хүсэлт илгээх - Яам Админ руу илгээх
     * Баталгаажуулах - Байгууллагын хэрэглэгч рүү явуулах
     * Буцаагдсан - Байгууллагын хэрэглэгч рүү явуулах
     * Өөрчлөлт хийх хүсэлт - Яам Админ руу илгээх
     * Ашиглалтаас гарах хүсэлт - Яам Админ руу илгээх
     */

    const info = await getUserInfoModel(parseInt(data.user_id));
    const userInfoAdmin = await getUserInfoByLevelModel(1);

    let subject = ''
    let text = ''
    let toMail = ''
    if (info || userInfoAdmin) {
      if (data.action_type == 2) {
        subject = 'Баталгаажуулах хүсэлт'
        text = `Таньд дараах байгууллагаас хүсэлт ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b>`
        toMail = userInfoAdmin?.email ?? ''
      } else if (data.action_type == 3) {
        subject = 'Баталгаажуулах хүсэлт'
        text = `Таны илгээсэн хүсэлт баталгаажсан байна.`
        toMail = info?.email ?? ''
      } else if (data.action_type == 4) {
        subject = 'Буцаагдсан хүсэлт'
        text = `Таны илгээсэн хүсэлт буцаагдсан байна.`
        toMail = info?.email ?? ''
      } else if (data.action_type == 5) {
        subject = 'Өөрчлөлт хийх хүсэлт'
        text = `Таньд дараах байгууллагаас [Өөрчлөлт хийх хүсэлт] ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b> Өгөгдлийн сангийн нэр: <b> ${info?.md_user_database?.database?.name}</b>`
        toMail = userInfoAdmin?.email ?? ''
      } else if (data.action_type == 6) {
        subject = 'Ашиглалтаас гарах хүсэлт'
        text = `Таньд дараах байгууллагаас [Ашиглалтаас гарах хүсэлт] ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b> Өгөгдлийн сангийн нэр: <b> ${info?.md_user_database?.database?.name}</b>`
        toMail = userInfoAdmin?.email ?? ''
      }

      const template = await mailTemplateDbStatusChangeUser(toMail, subject, text, process.env.HOST_BASE_URL)
      await sendMail(template)
    }

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    return res.json();
  // } catch (error) {
  //   console.error("Error in updateActionService:", error);
  //   throw new Error(error.toString());
  // }
};

const getActionService = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/actions`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to updateActionService post data");
  }

  return res.json();
};

const getActionByIdService = async (id: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/action/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getActionById data");
  }

  return res.json();
};

export { checkValidationStatus, getActionService, updateActionService, getActionByIdService };
