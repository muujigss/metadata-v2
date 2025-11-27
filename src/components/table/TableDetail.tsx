"use client";
import { ITable } from "@/interfaces/ITable";
import { useGetSecurityLevels, useGetSources } from "@/utils/customHooks";
import { Card, Kbd } from "flowbite-react";
import Link from "next/link";
import Loader from "../Loader";
import { ISecurity, ISource } from "@/interfaces/ILib";

const TableDetail = ({ data }: { data: ITable }) => {
  const {
    data: libSources,
    isLoading: isLoadingSource,
    isError: isErrorSource,
  } = useGetSources();
  const {
    data: libSecurityLevels,
    isLoading,
    isError,
  } = useGetSecurityLevels();

  if (isError) return <p>Алдаа гарлаа ...</p>;
  if (isErrorSource) return <p>Алдаа гарлаа ...</p>;

  if (isLoading) return <Loader />;
  if (isLoadingSource) return <Loader />;
  return (
    <Card className="mx-auto flex self-stretch justify-between mt-2">
      <div className="relative overflow-x-auto ">
        <table className="site-table w-full text-left rtl:text-right text-secondary-medium">
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
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                1
              </th>
              <td className="px-6 py-2">Хүснэгтийн тухай ойлголт</td>
              <td className="px-6 py-2">{data?.description}</td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-2">Анхан шатны мэдээлэгч эх үүсвэр</td>
              <td className="px-6 py-2">
                {data?.source?.length > 0 &&
                  data?.source.map((item, i) => (
                    <div key={i} className="m-1">
                      <Kbd className=" font-thin text-text-table-small">
                        {libSources?.find(
                          (spec: ISource) => +spec.id == +item.id
                        )?.name || item.id}
                      </Kbd>
                    </div>
                  ))}
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                3
              </th>
              <td className="px-6 py-2">
                Анхан шатны мэдээлэгч эх үүсвэр бусад бичих
              </td>
              <td className="px-6 py-2">{data?.source_other}</td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                4
              </th>
              <td className="px-6 py-2">Нууцын зэрэглэл</td>
              <td className="px-6 py-2">
                {data?.security_level &&
                  data?.security_level.map((item, i) => (
                    <div className="m-1" key={i}>
                      <Kbd className=" font-thin text-text-table-small">
                        {libSecurityLevels?.find(
                          (spec: ISecurity) => spec.id == +item.id
                        )?.name || item.id}
                      </Kbd>
                    </div>
                  ))}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                5
              </th>
              <td className="px-6 py-2">
                Хүснэгтийн мэдээлэл нь нээлттэй өгөгдлийг ашиглах лицензийн
                төрөл
              </td>
              <td className="px-6 py-2">{data?.licence_type}</td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              ></th>
              <td className="px-6 py-2">
                Хүснэгтийн мэдээлэл нь нээлттэй өгөгдлийг ашиглах лицензийн
                төрөл бусад
              </td>
              <td className="px-6 py-2">{data?.licence_type_other}</td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                6
              </th>
              <td className="px-6 py-2">
                Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж
                болох цахим хуудасны хаяг
              </td>
              <td className="px-6 py-2">
                {data?.opendata_licence_url && (
                  <a
                    className=" text-primary-high text-text-body-small hover:text-primary-default"
                    href={data?.opendata_licence_url}
                  >
                    {data?.opendata_licence_url}
                  </a>
                )}
              </td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                7
              </th>
              <td className="px-6 py-2">Хүснэгт үүсгэсэн огноо</td>
              <td className="px-6 py-2">{data?.started_date}</td>
            </tr>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-blue-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-blue-500 whitespace-nowrap dark:text-white"
              >
                8
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
  );
};

export default TableDetail;
