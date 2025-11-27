import * as Yup from "yup";

const validationSchema = Yup.object({
  item_id: Yup.string().required("Өгөгдлийн сан сонгоно уу."),
  user_id: Yup.string().required("Албан хаагч сонгоно уу."),
  // description: Yup.string().required("Өгөгдлийн сангийн тайлбар оруулна уу."),
});
export { validationSchema };
