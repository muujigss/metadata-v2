import * as Yup from "yup";

const validationSchema = Yup.object({
  org_id: Yup.string().required("Байгууллагаа сонгоно уу."),
  name: Yup.string().required("Өгөгдлийн сангийн нэр оруулна уу."),
  description: Yup.string().required("Өгөгдлийн сангийн тайлбар оруулна уу."),
  spec: Yup.array()
    .of(Yup.number().required("Зориулалтын төрөл сонгоно уу."))
    .min(1, "Зориулалтын төрөл сонгоно уу.")
    .required("Зориулалтын төрөл сонгоно уу."),
  spec_other: Yup.string()
    .nullable()
    .when("spec", (specification) => {
      const sp = specification?.map((spec: any) => {
        return spec.includes(4);
      })[0];

      if (sp) {
        return Yup.string().required("Бусад зориулалт бичнэ үү.");
      }
      return Yup.string();
    }),
  db_type: Yup.number().required("Өгөгдлийн сангийн төрөл сонгоно уу."),
  db_type_other: Yup.string()
    .nullable()
    .when("db_type", (dbType) => {
      if (dbType.includes(8)) {
        return Yup.string().required("Өгөгдлийн сангийн төрөл бусад бичнэ үү.");
      }
      return Yup.string();
    }),
  db_location: Yup.number().required("Өгөгдлийн сангийн байршил сонгоно уу."),
  db_location_other: Yup.string()
    .nullable()
    .when("db_location", (dbLocation) => {
      if (dbLocation.includes(5)) {
        return Yup.string().required("Өгөгдлийн сангийн байршил бичнэ үү.");
      }
      return Yup.string();
    }),
  sector: Yup.string().required("Салбар сонгоно уу."),
  sector_other: Yup.string().when("sector", (sector) => {
    if (sector.includes("43")) {
      return Yup.string().required("Салбар бичнэ үү.");
    }
    return Yup.string();
  }),
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
  opendata_url: Yup.string()
    .nullable()
    .when("licence_type", (licence) => {
      if (licence.includes("2")) {
        return Yup.string().required("Нээлттэй өгөгдлийн URL оруулна уу.");
      }
      return Yup.string();
    }),
  // .required("Нээлттэй өгөгдлийн URL оруулна уу."),
  start_date: Yup.string()
    .required("Өгөгдлийн санг нэвтрүүлсэн огноо оруулна уу.")
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
  table_count: Yup.number().required("Хүснэгтийн тоо оруулна уу."),
});
export { validationSchema };
