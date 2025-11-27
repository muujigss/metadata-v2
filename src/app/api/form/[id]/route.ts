import { getFormModel, updateFormModel } from "@/services/model/FormModel";
import { NextResponse, NextRequest } from "next/server";
// import { uploadToCloudinary } from "../uploadHelper";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const dt = await getFormModel(+id);

  return NextResponse.json(dt);
}

export async function POST(req: NextRequest, { params: { id } }: Props) {
  try {
    const body = await req.formData();

    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

    const resUpload = await fetch(url, {
      method: "POST",
      body: body,
    });

    const resData = await resUpload.json();

    if (!resData) {
      return NextResponse.json({
        data: resData,
        error: "Зураг upload хийхэд алдаа гарлаа",
        message: "error",
      });
    }
    const model = updateFormModel(+id, resData.secure_url);
    if (!model) {
      return NextResponse.json({
        data: model,
        error: "Зураг хадгалахад алдаа гарлаа",
        message: "error",
      });
    }

    return NextResponse.json({ data: model, message: "success" });
  } catch (error) {
    NextResponse.json({ error, message: "error" });
  }
}

export async function PUT(req: NextRequest, { params: { id } }: Props) {
  const body = await req.json();
  const dt = await updateFormModel(+id, body);
  if (!dt) {
    return NextResponse.json({
      data: dt,
      message: "error",
    });
  }
  return NextResponse.json(dt);
}

// export async function POST(req: NextRequest, { params: { id } }: Props) {
//   try {
//     const body = await req.formData();

//     const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

//     const resUpload = await fetch(url, {
//       method: "POST",
//       body: body,
//     });

//     const resData = await resUpload.json();

//     if (!resData) {
//       return NextResponse.json({
//         data: resData,
//         error: "Зураг upload хийхэд алдаа гарлаа",
//         message: "error",
//       });
//     }

//     console.log({ resData });

//     const model = updateFormModel(+id, resData.secure_url);
//     if (!model) {
//       return NextResponse.json({
//         data: model,
//         error: "Зураг хадгалахад алдаа гарлаа",
//         message: "error",
//       });
//     }

//     return NextResponse.json({ data: model, message: "success" });
//   } catch (error) {
//     NextResponse.json({ error, message: "error" });
//   }
// }

// export async function PUT(req: NextRequest, { params: { id } }: Props) {
//   const body = await req.json();
//   const dt = await updateFormModel(+id, body);
//   if (!dt) {
//     return NextResponse.json({
//       data: dt,
//       message: "Хадгалахад алдаа гарлаа",
//       status: "error",
//     });
//   } else {
//     return NextResponse.json({
//       data: dt,
//       message: "Амжилттай хадгаллаа",
//       status: "success",
//     });
//   }
// }
