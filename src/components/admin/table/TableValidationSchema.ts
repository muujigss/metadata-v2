import moment from "moment";
import * as Yup from "yup";

const validationSchema = Yup.object({
  db_id: Yup.string().required("Өгөгдлийн сан сонгоно уу."),
  name: Yup.string().required("Хүснэгтийн нэр оруулна уу."),
  description: Yup.string().required("Хүснэгтийн тухай ойлголт оруулна уу."),
  source: Yup.array()
    .of(Yup.number().required("Анхан шатны мэдээлэгч эх үүсвэр  сонгоно уу."))
    .min(1, "Анхан шатны мэдээлэгч эх үүсвэр сонгоно уу.")
    .required("Анхан шатны мэдээлэгч эх үүсвэр сонгоно уу."),
  source_other: Yup.string()
    .nullable()
    .when("source", (source) => {
      if (source.includes(5)) {
        return Yup.string().required(
          "Анхан шатны мэдээлэгч эх үүсвэр бичнэ үү."
        );
      }
      return Yup.string();
    }),
  security_level: Yup.array()
    .of(Yup.number().required("Нууцын зэрэглэл сонгоно уу."))
    .min(1, "Нууцын зэрэглэл сонгоно уу.")
    .required("Нууцын зэрэглэл сонгоно уу."),

  licence_type: Yup.string().required(
    "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл сонгоно уу."
  ),
  licence_type_other: Yup.string()
    .nullable()
    .when("licence_type", (openDataLicence) => {
      if (openDataLicence.includes("5")) {
        return Yup.string().required(
          "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бичнэ үү."
        );
      }
      return Yup.string();
    }),
  opendata_licence_url: Yup.string()
    .nullable()
    .when("licence_type", (type) => {
      if (type.includes("2")) {
        return Yup.string().required("Нээлттэй өгөгдлийн URL бичнэ үү.");
      }
      return Yup.string();
    }),
  started_date: Yup.date()
    ?.transform(function (value, originValue) {
      const currentYear = moment().format("YYYY-MM-DD");
      const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
      if (originValue > currentYear || originValue < beforeYear) {
        return true;
      }
      return value;
    })
    .typeError("Хүснэгт үүсгэсэн огноо буруу байна.")
    .required("Хүснэгт үүсгэсэн огноо оруулна уу."),
});
export { validationSchema };
