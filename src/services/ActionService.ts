"use server";

import { IAction } from "@/interfaces/IAction";
import { sendMail } from "./MailService";
import { checkStatusMetadata } from "./model/DatabaseModel";
import { getUserInfoByLevelModel, getUserInfoModel } from "./model/UserModel";

const updateActionService = async (data: IAction) => {
  let checkStatus = await checkStatusMetadata(data?.item_id);

  if (!checkStatus?.status) {
    return {
      status: false,
      message: checkStatus?.message,
    };
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

  const info = await getUserInfoModel(data.user_id);
  const userInfoAdmin = await getUserInfoByLevelModel(1);

  let mailObj = {};
  // to, // Recipient address
  //     subject, // Subject line
  //     text, // Plain text body
  //     html, // HTML body
  if (info || userInfoAdmin) {
    if (data.action_type == 2) {
      mailObj = {
        to: userInfoAdmin?.email,
        subject: "Баталгаажуулах хүсэлт",
        html: `Сайн байна уу, <br/><br/> Таньд дараах байгууллагаас хүсэлт ирсэн байна. <br/> Байгууллагын нэр: <b> ${info?.organization.name}</b> <br/><br/> Та Төрийн мета өгөгдлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
      };
    } else if (data.action_type == 3) {
      mailObj = {
        to: info?.email,
        subject: "Баталгаажсан хүсэлт",
        html: `Сайн байна уу, <br/><br/> Таны илгээсэн хүсэлт баталгаажсан байна. Төрийн мета өгөгдлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/><br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
      };
    } else if (data.action_type == 4) {
      mailObj = {
        to: info?.email,
        subject: "Буцаагдсан хүсэлт",
        html: `Сайн байна уу, <br/><br/> Таны илгээсэн хүсэлт буцаагдсан байна. Төрийн мета өгөгдлийн нэгдсэн санд хандан хүсэлтийг шалгах боломжтой. <br/><br/> <a href="${process.env.BASE_URL}/login">Нэвтрэх</a> <br/> Баярлалаа`,
      };
    }

    let aa = sendMail(mailObj);
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
};

const getActionService = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/actions`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
};

export { getActionService, updateActionService };
