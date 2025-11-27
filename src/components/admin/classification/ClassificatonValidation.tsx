import moment from "moment";
import * as Yup from "yup";

export const ClassificationValidation = ({
  classData,
}: {
  classData?: any;
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Ангиллын нэр оруулна уу."),
    code: Yup.string().required("Ангиллын код оруулна уу."),
    definition: Yup.string().required("Ангиллын тухай ойлголт оруулна уу."),
    confirmed_decree_date: Yup.date()
      .transform(function (value, originValue) {
        const currentYear = moment().format("YYYY-MM-DD");
        const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
        if (originValue > currentYear || originValue < beforeYear) {
          return true;
        }
        return value;
      })
      .typeError("Маягт батлагдсан огноо буруу байна.")
      .required("Маягт батлагдсан огноо оруулна уу."),
    implemented_date: Yup.date()
      ?.transform(function (value, originValue) {
        const currentYear = moment().format("YYYY-MM-DD");
        const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
        if (originValue > currentYear || originValue < beforeYear) {
          return true;
        }
        return value;
      })
      .typeError("Ангилал, кодыг нэвтрүүлсэн огноо буруу байна."),
    last_updated_date: Yup.date()
      ?.transform(function (value, originValue) {
        const currentYear = moment().format("YYYY-MM-DD");
        const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
        if (originValue > currentYear || originValue < beforeYear) {
          return true;
        }
        return value;
      })
      .typeError("Ангиллыг хамгийн сүүлд шинэчилсэн огноо буруу байна."),
    // version: Yup.string()
    //   .transform((value) => {
    //     if (value <= classData?.version) {
    //       return true;
    //     }

    //     return value;
    //   })
    //   .typeError("Ангиллын хувилбар өмнөх хувилбараас бага байна.")
    //   .required("Ангиллын хувилбар оруулна уу."),
    classificationCode: Yup.array()
      .transform((value) => {
        if (classData?.classificationCode?.length === 0) {
          return value;
        }
        return value;
      })
      .typeError("Ангиллын кодын жагсаалт оруулна уу.")
      .min(1, "Ангилал кодын жагсаалт оруулна уу."),
  });
  return validationSchema;
};
// export { validationSchema };
