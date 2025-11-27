import React, { useState } from "react";
import { Formik } from "formik";
import InputComponent from "../admin/form/InputComponent";
import { Alert, Button } from "@mui/material";
import SwitchComponent from "../admin/form/SwitchComponent";
import * as Yup from "yup";
import { createClassification } from "@/services/ClassificationService";
import Loader from "../Loader";
import Link from "next/link";
import Download2LineIcon from "remixicon-react/Download2LineIcon";

const ClassificationCreate = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  if (loading) return <Loader />;

  return (
    <div className="bg-white px-4 py-4 w-full">
      <p className="text-text-title-medium py-2">Ангилал нэмэх</p>

      <Formik
        initialValues={{
          classification_code: "",
          classification_name: "",
          classification_definition: "",
          is_confirm: false,
          confirmed_decree_name: "",
          confirmed_decree_num: "",
          confirmed_decree_date: null,
          confirmed_organization1: "",
          confirmed_organization2: "",
          confirmed_organization3: "",
          implemented_date: null,
          last_updated_date: null,
        }}
        validationSchema={Yup.object({
          classification_code: Yup.string().required("Шифр оруулна уу"),
          classification_name: Yup.string().required(
            "Ангилалын нэр оруулна уу"
          ),
        })}
        onSubmit={async (values: any) => {
          setLoading(true);
          const response = await createClassification(values);
          if (response?.status == "success") {
            setLoading(false);
            setStatus(response?.status);
          } else {
            setStatus("error");
            setLoading(false);
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form onSubmit={handleSubmit}>
              {status == "success" ? (
                <Alert severity="success">Амжилттай хадгаллаа ... </Alert>
              ) : status == "error" ? (
                <Alert severity="error">Хадгалахад алдаа гарлаа ...</Alert>
              ) : null}
              <div className="grid grid-cols-3 gap-4">
                <InputComponent
                  name="classification_code"
                  label="Шифр"
                  type="text"
                  value={values.classification_code}
                  onChange={(e) =>
                    setFieldValue("classification_code", e.target.value)
                  }
                  errors={errors.classification_code}
                />
                <InputComponent
                  name="classification_name"
                  label="Ангилалын нэр"
                  type="text"
                  value={values.classification_name}
                  onChange={(e) =>
                    setFieldValue("classification_name", e.target.value)
                  }
                  errors={errors.classification_name}
                />
                <InputComponent
                  name="classification_definition"
                  label="Тодорхойлолт"
                  type="text"
                  value={values.classification_definition}
                  onChange={(e) =>
                    setFieldValue("classification_definition", e.target.value)
                  }
                />
                <SwitchComponent
                  name="is_confirm"
                  label="Ангилал, кодыг баталсан эсэх	"
                  defaultChecked={values.is_confirm}
                  onChange={(e) =>
                    setFieldValue("is_confirm", e.target.checked)
                  }
                />
                <InputComponent
                  name="confirmed_decree_name"
                  label="Ангилал, кодыг баталсан тушаал шийдвэрийн нэр"
                  type="text"
                  value={values.confirmed_decree_name}
                  onChange={(e) =>
                    setFieldValue("confirmed_decree_name", e.target.value)
                  }
                />
                <InputComponent
                  name="confirmed_decree_num"
                  label="Ангилал, кодыг баталсан тушаал шийдвэрийн дугаар"
                  type="text"
                  value={values.confirmed_decree_num}
                  onChange={(e) =>
                    setFieldValue("confirmed_decree_num", e.target.value)
                  }
                />
                <InputComponent
                  name="confirmed_decree_date"
                  label="Ангилал, кодыг баталсан огноо"
                  type="date"
                  value={values.confirmed_decree_date}
                  onChange={(e) =>
                    setFieldValue("confirmed_decree_date", e.target.value)
                  }
                />
                <InputComponent
                  name="confirmed_organization1"
                  label="Ангилал, кодыг баталсан байгууллага 1"
                  type="text"
                  value={values.confirmed_organization1}
                  onChange={(e) =>
                    setFieldValue("confirmed_organization1", e.target.value)
                  }
                />
                <InputComponent
                  name="confirmed_organization2"
                  label="Ангилал, кодыг баталсан байгууллага 2"
                  type="text"
                  value={values.confirmed_organization2}
                  onChange={(e) =>
                    setFieldValue("confirmed_organization2", e.target.value)
                  }
                />
                <InputComponent
                  name="confirmed_organization3"
                  label="Ангилал, кодыг баталсан байгууллага 3"
                  type="text"
                  value={values.confirmed_organization3}
                  onChange={(e) =>
                    setFieldValue("confirmed_organization3", e.target.value)
                  }
                />
                <InputComponent
                  name="implemented_date"
                  label="Ангилал, кодыг нэвтрүүлсэн огноо"
                  type="date"
                  value={values.implemented_date}
                  onChange={(e) =>
                    setFieldValue("implemented_date", e.target.value)
                  }
                />
                <InputComponent
                  name="last_updated_date"
                  label="Ангиллыг хамгийн сүүлд шинэчилсэн огноо"
                  type="date"
                  value={values.last_updated_date}
                  onChange={(e) =>
                    setFieldValue("last_updated_date", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end p-2">
                <Button
                  className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                  variant="contained"
                  color="success"
                  type="submit"
                  size="small"
                >
                  Хадгалах
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default ClassificationCreate;
