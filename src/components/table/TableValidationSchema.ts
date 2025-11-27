import * as Yup from "yup";

const validationSchema = Yup.object({
  db_id: Yup.string().required("Өгөгдлийн сан сонгоно уу."),
  tbl_name: Yup.string().required("Хүснэгтийн нэр оруулна уу."),
  table_description: Yup.string().required(
    "Хүснэгтийн тухай ойлголт оруулна уу."
  ),
  source: Yup.array()
    .of(Yup.number().required("Анхан шатны мэдээлэгч эх үүсвэр  сонгоно уу."))
    .min(1, "Анхан шатны мэдээлэгч эх үүсвэр сонгоно уу.")
    .required("Анхан шатны мэдээлэгч эх үүсвэр сонгоно уу."),
  source_other: Yup.string().when("source", (source) => {
    if (source.includes("s43")) {
      return Yup.string().required("Анхан шатны мэдээлэгч эх үүсвэр бичнэ үү.");
    }
    return Yup.string();
  }),
  security_level: Yup.array()
    .of(Yup.number().required("Нууцын зэрэглэл сонгоно уу."))
    .min(1, "Нууцын зэрэглэл сонгоно уу.")
    .required("Нууцын зэрэглэл сонгоно уу."),

  opendata_licence_type: Yup.string().required(
    "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл сонгоно уу."
  ),
  opendata_licence_type_other: Yup.string().when(
    "opendata_licence_type",
    (openDataLicence) => {
      if (openDataLicence.includes("5")) {
        return Yup.string().required(
          "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бичнэ үү."
        );
      }
      return Yup.string();
    }
  ),
  opendata_licence_url: Yup.string().required(
    "Нээлттэй өгөгдлийн URL оруулна уу."
  ),
  started_date: Yup.date().required("Хүснэгт үүсгэсэн огноо оруулна уу."),
});
export { validationSchema };
