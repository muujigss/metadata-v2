import moment from "moment";
import * as Yup from "yup";

const validationSchema = Yup.object({
  tbl_id: Yup.string().required("Хүснэгтийн нэр сонгоно уу."),
  code: Yup.string().required("Үзүүлэлтийн шифр оруулна уу."),
  name: Yup.string().required("Үзүүлэлтийн нэр оруулна уу."),
  frequency_id: Yup.string().required(
    "Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж сонгоно уу."
  ),
  frequency_other: Yup.string().when("frequency_id", (frequency: any) => {
    if (frequency.includes("7")) {
      return Yup.string().required(
        "Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж бичнэ үү."
      );
    }
    return Yup.string();
  }),
  // unit_id: Yup.string().required("Хэмжих нэгж сонгоно уу."),
  value_type_id: Yup.string().required("Утгын төрөл сонгоно уу."),
  security_level_id: Yup.string().required("Нууцын зэрэглэл сонгоно уу."),
  is_methodology: Yup.string().required(
    "Аргачлал, арга зүй байгаа эсэх сонгоно уу."
  ),
  methodology: Yup.string().when("is_methodology", (isMethodology) => {
    if (isMethodology.includes("true")) {
      return Yup.string().required("Аргачлал, арга зүйн нэр оруулна уу.");
    } else {
      return Yup.string();
    }
  }),
  is_methodology_confirm: Yup.string().when(
    "is_methodology",
    (isMethodology) => {
      if (isMethodology.includes("true")) {
        return Yup.string().required(
          "Аргачлал, арга зүйг баталсан эсэх сонгоно уу."
        );
      } else {
        return Yup.string();
      }
    }
  ),
  methodology_decree_num: Yup.string().when(
    "is_methodology_confirm",
    (is_methodology_confirm) => {
      if (is_methodology_confirm.includes("true")) {
        return Yup.string().required(
          "Аргачлал, арга зүйг баталсан тушаалын дугаар оруулна уу"
        );
      } else {
        return Yup.string();
      }
    }
  ),
  methodology_date: Yup.date().when(
    "is_methodology_confirm",
    (is_methodology_confirm) => {
      if (is_methodology_confirm.includes("true")) {
        return Yup.date()
          .transform(function (value, originValue) {
            const currentYear = moment().format("YYYY-MM-DD");
            const beforeYear = moment("1900-01-01").format("YYYY-MM-DD");
            if (originValue > currentYear || originValue < beforeYear) {
              return true;
            }
            return value;
          })
          .typeError("Аргачлал, арга зүйг баталсан огноо буруу байна.")
          .required("Аргачлал, арга зүйг баталсан огноо оруулна уу.");
      } else {
        return Yup.date();
      }
    }
  ),
  confirmed_organtization: Yup.string().when(
    "is_methodology_confirm",
    (is_methodology_confirm) => {
      if (is_methodology_confirm.includes("true")) {
        return Yup.string().required(
          "Аргачлал, арга зүйг баталсан байгууллагын нэр оруулна уу"
        );
      } else {
        return Yup.string();
      }
    }
  ),
  generated_date: Yup.string()
    .min(4, "Он 4 оронгоос бага байна.")
    .max(4, "Он  4 оронгоос их байна.")
    .required("Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он оруулна уу.")
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
    .typeError("Он буруу байна.")
    .required("Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он оруулна уу."),
  is_classification: Yup.string().required(
    "Ангилал, код байгаа эсэх сонгоно уу."
  ),
  classification_count: Yup.number().when(
    "is_classification",
    (is_classification) => {
      if (is_classification.includes("true")) {
        return Yup.number()
          .transform((value) => {
            if (value === 0) {
              return true;
            }
            return value;
          })
          .typeError("Ангилал, кодын тоогоо оруулна уу.")
          .required("Ангилал, кодын тоогоо оруулна уу");
      } else {
        return Yup.number();
      }
    }
  ),
  // version: Yup.string().required("Хувилбараа оруулна уу."),
});
export { validationSchema };
