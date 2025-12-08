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
  try {
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

    //Хүсэлт илгээх //Яам руу явуулах
    //Баталгаажуулах //тухайн хэрэглэгч рүү явуулах
    //Буцаагдсан //тухайн хэрэглэгч рүү явуулах

    const info = await getUserInfoModel(parseInt(data.user_id));
    const userInfoAdmin = await getUserInfoByLevelModel(1);

    // let mailObj = {};
    let subject = ''
    let text = ''
    if (info || userInfoAdmin) {
      if (data.action_type == 2) {
        subject = 'Баталгаажуулах хүсэлт'
        text = `Таньд дараах байгууллагаас хүсэлт ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b>`
        // mailObj = {
        //   to: userInfoAdmin?.email,
        //   subject: "Баталгаажуулах хүсэлт",
        //   html: `Сайн байна уу, <br/><br/> Таньд дараах байгууллагаас хүсэлт ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b> <br/><br/> Та Төрөлжсөн бүртгэлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
        // };
      } else if (data.action_type == 3) {
        subject = 'Баталгаажуулах хүсэлт'
        text = `Таны илгээсэн хүсэлт баталгаажсан байна.`
        // mailObj = {
        //   to: info?.email,
        //   subject: "Баталгаажсан хүсэлт",
        //   html: `Сайн байна уу, <br/><br/> Таны илгээсэн хүсэлт баталгаажсан байна. Төрөлжсөн бүртгэлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/><br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
        // };
      } else if (data.action_type == 4) {
        subject = 'Буцаагдсан хүсэлт'
        text = `Таны илгээсэн хүсэлт буцаагдсан байна.`
        // mailObj = {
        //   to: info?.email,
        //   subject: "Буцаагдсан хүсэлт",
        //   html: `Сайн байна уу, <br/><br/> Таны илгээсэн хүсэлт буцаагдсан байна. Төрөлжсөн бүртгэлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/><br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
        // };
      }

      // sendMail(mailObj);

      const template = await mailTemplateDbStatusChangeUser(userInfoAdmin?.email, subject, text, process.env.HOST_BASE_URL)
      await sendMail(template)
    }

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    return res.json();
  } catch (error) {
    console.error("Error in updateActionService:", error);
    throw new Error(error.toString());
  }
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
