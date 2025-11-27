import moment from "moment";
import * as Yup from "yup";

const fileType = ["application/pdf"];
const validationSchema = Yup.object({
  db_id: Yup.string().required("Өгөгдлийн сан сонгоно уу"),
  name: Yup.string().required("Маягтын нэр оруулна уу"),
  code: Yup.string().required("Маягтын шифр, дугаар оруулна уу"),
  description: Yup.string().required("Маягтын тайлбар оруулна уу"),
  decree_num: Yup.string().required("Тушаалын дугаар оруулна уу"),
  confirmed_date: Yup.date()
    ?.transform(function (value, originValue) {
      const currentYear = moment().format("YYYY-MM-DD");
      const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
      if (originValue > currentYear || originValue < beforeYear) {
        return true;
      }
      return value;
    })
    .typeError("Маягт баталсан огноо буруу байна.")
    .required("Маягт баталсан огноо оруулна уу."),
  confirmed_org1: Yup.string().required(
    "Маягт баталсан байгууллага оруулна уу"
  ),
  sector_id: Yup.string().required("Салбар сонгоно уу"),
  sector_other: Yup.string().when("sector_id", (sector) => {
    if (sector.includes("43")) {
      return Yup.string().required("Салбар бичнэ үү.");
    }
    return Yup.string();
  }),
  // sub_sector: Yup.string().required("Дэд салбар бичнэ үү"),
  // coorperate_org: Yup.string().required(
  //   "Хамтран гаргадаг байгууллага	бичнэ үү."
  // ),
  source_id: Yup.array()
    .of(
      Yup.number().required(
        "Анхан шатны мэдээлэгч/ эх үүсврийн төрөл сонгоно уу."
      )
    )
    .min(1, "Анхан шатны мэдээлэгч/ эх үүсврийн төрөл сонгоно уу."),
  source_other: Yup.string()
    .nullable()
    .when("source_id", (source_id) => {
      if (source_id.includes(5)) {
        return Yup.string().required(
          "Анхан шатны мэдээлэгч/ эх үүсврийн төрөл бичнэ үү."
        );
      }
      return Yup.string().nullable();
    }),
  collection_method_id: Yup.array()
    .of(
      Yup.number().required("Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр сонгоно уу.")
    )
    .min(1, "Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр сонгоно уу."),
  collection_method_other: Yup.string()
    .nullable()
    .when("collection_method_id", (collection) => {
      const sp = collection?.map((sc: any) => {
        return sc.includes(7);
      })[0];

      if (sp) {
        return Yup.string().required(
          "Мэдээлэл цуглуулах, бүрдүүлэх бусад хэлбэр бичнэ үү."
        );
      }
      return Yup.string();
    }),
  frequency_id: Yup.string().required("Давтамж сонгоно уу"),
  frequency_other: Yup.string()
    .nullable()
    .when("frequency_id", (frequency) => {
      if (frequency.includes("7")) {
        return Yup.string().required("Давтамж бичнэ үү.");
      }
      return Yup.string();
    }),
  collection_started_date: Yup.string()
    .min(4, "Он 4 оронгоос бага байна.")
    .max(4, "Он  4 оронгоос их байна.")
    .required("Бүрдүүлж эхэлсэн он оруулна уу.")
    .transform((value, originalValue) => {
      const currentYear = new Date().getFullYear();
      const beforeYear = new Date("1900-01-01").getFullYear();
      if (
        Number(originalValue) > currentYear ||
        Number(originalValue) < beforeYear
      ) {
        return true;
      }
      return value;
    })
    .typeError("Он буруу байна."),
  form_generation_date: Yup.string()
    .min(4, "Он 4 оронгоос бага байна.")
    .max(4, "Он  4 оронгоос их байна.")
    .transform((value, originalValue) => {
      const currentYear = new Date().getFullYear();
      const beforeYear = new Date("1900-01-01").getFullYear();
      if (
        Number(originalValue) > currentYear ||
        Number(originalValue) < beforeYear
      ) {
        return true;
      }
      return value;
    })
    .typeError("Он буруу байна."),
  form_updated_date: Yup.string()
    .min(4, "Он 4 оронгоос бага байна.")
    .max(4, "Он  4 оронгоос их байна.")
    .transform((value, originalValue) => {
      const currentYear = new Date().getFullYear();
      const beforeYear = new Date("1900-01-01").getFullYear();
      if (
        Number(originalValue) > currentYear ||
        Number(originalValue) < beforeYear
      ) {
        return true;
      }
      return value;
    })
    .typeError("Он буруу байна."),
  dissimenation_level_id: Yup.string().required(
    "Үр дүнг тархаах түвшин сонгоно уу."
  ),
  uploadFile: Yup.mixed()
    .nullable("Файл оруулна уу.")
    .test("is-not-pdf", "Файлын төрөл буруу байна", (value: any) => {
      if (!value) {
        return true;
      }
      if (value && fileType.includes(value.type)) {
        return true;
      }
      return false;
    }),
  // .required("Файл оруулна уу."),
  form_table_count: Yup.string().required("Маягтын хүснэгтийн тоо оруулна уу."),
});
export { validationSchema };
