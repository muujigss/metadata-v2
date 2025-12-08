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

const validationTab0Schema = Yup.object({
  tab0_name: Yup.string().required("Системийн нэр оруулна уу."),
  tab0_short_name: Yup.string().required("Системийн товч нэр оруулна уу."),
  tab0_domain_name: Yup.string().required("Системийн домэйн нэр оруулна уу."),
  tab0_purpose: Yup.string().required("Зорилго оруулна уу."),
  tab0_activity: Yup.string().required("Үйл ажиллагаа оруулна уу."),
  tab0_scope: Yup.string().required("Хамрах хүрээ оруулна уу."),
  // tab0_regulation_file_id: Yup.string().required("Дотооддоо мөрдөж буй дүрэм, журам, шийдвэр оруулна уу."),
  tab0_status_description: Yup.string().required("Сан шинээр үүсгэх, бүтцийн өөрчлөлт оруулсан, ашиглалтаас гаргасан мэдээлэл оруулна уу."),
  tab0_change_description: Yup.string().required("Сан бүртдүүлэх ашиглах, солилцох үйл ажиллагаанд мөрдөж буй стандарт оруулна уу."),
  tab0_service_list: Yup.array().of(Yup.string()).optional(), // "Үзүүлэх үйлчилгээний жагсаалт оруулна уу."
  tab0_other_info_list: Yup.string().required("Мэдээлэл цуглуулж, боловсруулж, ашиглаж буй мэдээлэл оруулна уу."),
  // tab0_full_org_info: Yup.string().required("Харуцагч байгууллагын нэр, хаяг, утасны дугаар, цахим шуудан оруулна уу."),
  // tab0_full_user_info: Yup.string().required("Харуцсан ажилтны нэр, хаяг, утасны дугаар, цахим шуудан оруулна уу."),
  tab0_copyright_description: Yup.string().required("Програм хангамж, мэдээллийн сангийн зохиогчийн эрхийн мэдээлэл оруулна уу."),
});

const validationTab1Schema = Yup.object({
  // tab1_name: Yup.string().required("Мэдээллийн сангийн нэр оруулна уу."),
  tab1_short_name: Yup.string().required("Мэдээллийн сангийн товч нэр оруулна уу."),
  tab1_db_type: Yup.string().required("Мэдээллийн сангийн төрөл оруулна уу."),
  tab1_db_manage_system: Yup.string().required("Мэдээллийн сан удирдах системийн нэр оруулна уу."),
  tab1_db_size: Yup.string().required("Мэдээллийн сангийн хэмжээ оруулна уу."),
  tab1_db_rows_count: Yup.string().required("Мэдээллийн сан дан бичлэгийн тоо оруулна уу."),
  tab1_resource_location: Yup.string().required("Мэдээллийн сан, түүний нөөцийн байршил оруулна уу."),
  // tab1_diagram_file_id: Yup.string().required("Мэдээллийн сангийн диаграм оруулна уу."),
  tab1_access_control_info: Yup.string().required("Хандах эрхийн зохицуулалтын мэдээлэл, тайлбар оруулна уу."),
  tab1_file_type_info: Yup.string().required("Мэдээллийн санд хадгалагдаж буй файлын төрлүүд оруулна уу."),
  tab1_info_supply: Yup.string().required("Мэдээллийн хариуцагчаас үндсэн системд нийлүүлж буй мэдээлэл оруулна уу."),
  tab1_service_name: Yup.string().required("Сервисийн нэр оруулна уу."),
  tab1_content_info_supply: Yup.string().required("Нийлүүлэх мэдээллийн агуулга оруулна уу."),
  tab1_input_values: Yup.string().required("Оролтын утгууд (төрөл, утга, тайлбар) оруулна уу."),
  tab1_output_values: Yup.string().required("Гаралтын утгууд (төрөл, утга, тайлбар) оруулна уу."),
});

export { validationSchema, validationTab0Schema, validationTab1Schema };
