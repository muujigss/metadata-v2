"use client";
import Loader from "@/components/Loader";
import { IForm } from "@/interfaces/IForm";
import { getFormsByNameService, uploadFormFile } from "@/services/FormService";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, FileInput, Label, Select } from "flowbite-react";
import { useState } from "react";

const AuthComponent = () => {
  const [formId, setFormId] = useState(0);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [isUploadLoading, setLoading] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["fetch form name list"],
    queryFn: () => getFormsByNameService(),
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа ...</p>;
  const onClickSaveBtn = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", process.env.CLOUDINARY_API_KEY);
    formData.append("folder", "forms");
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const response = await uploadFormFile(formId, formData);

    setStatus(response.message);
    setFormId(0);
    setImage("");

    setLoading(false);
  };

  const sendFile = async (files: any) => {
    const newArr = [];
    for (let i = 0; i < files[0].length; i++) {
      newArr.push(files[0][i]);
    }

    setImage(newArr[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={onClickSaveBtn}>
        <h1 className="mb-4 text-center text-text-title-medium uppercase font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Form Upload Page
        </h1>
        <div className="max-w-md mb-2">
          {isUploadLoading && (
            <Alert color="warning" className="mb-4">
              Хадгалж байна. Түр хүлээнэ үү
            </Alert>
          )}
          {status && (
            <Alert color="success" className="mb-4">
              {status === "success" ? "Амжилттай хадгалагдлаа" : status}
            </Alert>
          )}
        </div>

        <div className="max-w-md mb-2">
          <div className="mb-2 block">
            <Label htmlFor="countries" value="Select your form" />
          </div>
          <Select
            id="forms"
            required
            value={formId}
            onChange={(e) => {
              setFormId(e.target.value);
            }}
          >
            <option>Choose a form</option>
            {data.map((item: IForm) => (
              <option key={item.id} value={item.id}>
                {item.code +
                  " - " +
                  item.database.organization.name +
                  " - " +
                  item.name}
              </option>
            ))}
          </Select>
        </div>
        <div id="fileUpload" className="max-w-md mb-2">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Upload file" />
          </div>
          <FileInput
            onChange={(e) => {
              const arr = [];

              arr.push(e.target.files);

              sendFile(arr);
            }}
            id="file"
            helperText="*.pdf"
          />
        </div>
        <div className="max-w-md flex gap-1">
          <Button type="submit" color="blue">
            Save
          </Button>
          <Button
            onClick={() => {
              setStatus("");
            }}
            color="red"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthComponent;
