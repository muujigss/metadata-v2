"use client";
import { Button, Card, Kbd } from "flowbite-react";
import moment from "moment";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import Download2LineIcon from "remixicon-react/Download2LineIcon";
import { IForm } from "@/interfaces/IForm";
import { useGetCollectionMethod, useGetSources } from "@/utils/customHooks";
import { ICollectionMethod, ISource } from "@/interfaces/ILib";
import Loader from "../Loader";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getForm } from "@/services/FormService";
import BreadCrumpSubMenu from "../BreadCrumpSubMenu";
import DetailSideBar from "../detail-sidebar/DetailSideBar";

const FormDetail = ({ id }: { id: number }) => {
  const { data: libSources } = useGetSources();
  const { data: libCollectionMethod } = useGetCollectionMethod();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getForm by id", id],
    queryFn: () => getForm(id),
    refetchOnWindowFocus: true,
  });
  if (isError) return <p>Алдаа гарлаа! ...</p>;
  if (isLoading) return <Loader />;
  if (!data) return <p>Дээрх маягтын дугаар олдсонгүй! ...{id}</p>;

  return (
    <>
      <BreadCrumpSubMenu data={data} />
      <div className="container py-6 flex overflow-x-auto gap-4">
        <div className="w-1/3 bg-white border rounded-lg h-2/3">
          <DetailSideBar parent_id={data?.db_id} form_id={id} />
        </div>
        <Card className="mx-auto flex self-stretch justify-between mt-2 w-2/3 h-full">
          <div className="relative overflow-x-auto ">
            <div className="flex items-center justify-between">
              <div
                className="text-black mb-2 font-bold"
                style={{ fontSize: 24 }}
              >
                {data?.name}
              </div>
              <Button color="green" size={"medium"}>
                <a href={data?.files} download={data?.name} target="_blank">
                  <Download2LineIcon size={20} />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between text-text-body-medium2 text-secondary-default opacity-50 mb-2">
              <span className=" inline-flex items-center">
                <Calendar2LineIcon size={14} color="#333a3f" />
                <p className="px-2">
                  {data?.form_generated_date &&
                    moment(data?.form_generated_date).format("YYYY-MM-DD")}
                </p>
              </span>
            </div>
            <table className=" site-table w-full text-left rtl:text-right text-secondary-medium">
              <thead className=" text-secondary-default uppercase bg-table-default p-3 text-text-body-medium2">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    №
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Нэр
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Утга
                  </th>
                </tr>
              </thead>
              <tbody className=" text-text-body-medium2">
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    1
                  </th>
                  <td className="px-6 py-2">Маягтын шифр, дугаар</td>
                  <td className="px-6 py-2">{data?.code}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    2
                  </th>
                  <td className="px-6 py-2">Тушаалын дугаар</td>
                  <td className="px-6 py-2">{data?.decree_num}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    3
                  </th>
                  <td className="px-6 py-2">Маягт баталсан огноо</td>
                  <td className="px-6 py-2">
                    {" "}
                    {data?.confirmed_date &&
                      moment(data?.confirmed_date).format("YYYY-MM-DD")}
                  </td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    4
                  </th>
                  <td className="px-6 py-2">Баталсан байгууллага No1</td>
                  <td className="px-6 py-2">{data?.confirmed_org1}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    5
                  </th>
                  <td className="px-6 py-2">Баталсан байгууллага No2</td>
                  <td className="px-6 py-2">{data?.confirmed_org2}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    6
                  </th>
                  <td className="px-6 py-2">Салбар</td>
                  <td className="px-6 py-2">{data?.sector.name}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    7
                  </th>
                  <td className="px-6 py-2">Дэд салбар</td>
                  <td className="px-6 py-2">{data?.sub_sector}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    8
                  </th>
                  <td className="px-6 py-2">Хамтран гаргадаг байгууллага</td>
                  <td className="px-6 py-2">{data?.coorperate_org}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    9
                  </th>
                  <td className="px-6 py-2">
                    Анхан шатны мэдээлэгч/ эх үүсвэр
                  </td>
                  <td className="px-6 py-2">
                    {data?.source_id?.map((item, i) => (
                      <Kbd key={i} className=" font-thin text-text-table-small">
                        {libSources?.find(
                          (spec: ISource) => spec.id == +item.id
                        )?.name || item.id}
                      </Kbd>
                    ))}
                  </td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    10
                  </th>
                  <td className="px-6 py-2">
                    Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр
                  </td>
                  <td className="px-6 py-2">
                    {data?.collection_method_id?.map((item, i) => (
                      <div key={i} className="m-1">
                        <Kbd className=" font-thin text-text-table-small">
                          {libCollectionMethod?.find(
                            (spec: ICollectionMethod) => spec.id == +item.id
                          )?.name || item.id}
                        </Kbd>
                      </div>
                    ))}
                  </td>
                </tr>

                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    11
                  </th>
                  <td className="px-6 py-2">Давтамж</td>
                  {data?.frequency && data?.frequency != null && (
                    <td className="px-6 py-2">{data?.frequency?.name}</td>
                  )}
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    12
                  </th>
                  <td className="px-6 py-2">Бүрдүүлж эхэлсэн он</td>
                  <td className="px-6 py-2">
                    {data?.collection_started_date &&
                      moment(data?.collection_started_date).format(
                        "YYYY-MM-DD"
                      )}
                  </td>
                </tr>

                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    13
                  </th>
                  <td className="px-6 py-2">
                    Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа
                  </td>
                  <td className="px-6 py-2">
                    {data?.dissimenation_level?.name}
                  </td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    14
                  </th>
                  <td className="px-6 py-2">Маягт нөхөх заавартай эсэх</td>
                  <td className="px-6 py-2">{data?.is_form_guide}</td>
                </tr>

                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    15
                  </th>
                  <td className="px-6 py-2">Мэдээлэл цуглуулах ажилтан</td>
                  <td className="px-6 py-2">{data?.collected_officer}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    16
                  </th>
                  <td className="px-6 py-2">Нууцын зэрэглэл</td>
                  <td className="px-6 py-2"></td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    17
                  </th>
                  <td className="px-6 py-2">Хариуцдаг газар / хэлтэс/ нэгж</td>
                  <td className="px-6 py-2">{data?.owner_department}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    18
                  </th>
                  <td className="px-6 py-2">
                    Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг
                  </td>
                  <td className="px-6 py-2">
                    <a
                      className="text-blue-500 "
                      href={`mailto:${data?.owner_email}`}
                    >
                      {data?.owner_email}
                    </a>
                  </td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    19
                  </th>
                  <td className="px-6 py-2">
                    Хариуцсан нэгжийн холбоо барих албаны утас
                  </td>
                  <td className="px-6 py-2">
                    <a
                      className="text-blue-500 "
                      href={`tel:${data?.owner_phone}`}
                    >
                      {data?.owner_phone}
                    </a>
                  </td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    20
                  </th>
                  <td className="px-6 py-2">Маягт нэвтрүүлсэн огноо</td>
                  <td className="px-6 py-2">{data?.form_generated_date}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    21
                  </th>
                  <td className="px-6 py-2">Маягт шинэчилсэн огноо</td>
                  <td className="px-6 py-2">{data?.form_updated_date}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    22
                  </th>
                  <td className="px-6 py-2">Маягтын хүснэгтийн тоо</td>
                  <td className="px-6 py-2">{data?.form_table_count}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    23
                  </th>
                  <td className="px-6 py-2">Тооцож гаргадаг үзүүлэлтүүд</td>
                  <td className="px-6 py-2">{data?.estimated_indicators}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    24
                  </th>
                  <td className="px-6 py-2"> Түлхүүр үг</td>
                  <td className="px-6 py-2">{data?.keywords}</td>
                </tr>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    24
                  </th>
                  <td className="px-6 py-2">Өгөгдлийн сан</td>
                  <td className="px-6 py-2">
                    <Link
                      href={`/database/${data?.db_id}`}
                      className="text-blue-500"
                    >
                      Өгөгдлийн сан харах
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default FormDetail;
