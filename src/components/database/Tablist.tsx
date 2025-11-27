"use client";
import { IDatabase } from "@/interfaces/IDatabase";
import { ISpecification } from "@/interfaces/ISpecification";
import { ITable } from "@/interfaces/ITable";
import { useGetSpecification } from "@/utils/customHooks";
import { Kbd, TabItem, Tabs } from "flowbite-react";
import moment from "moment";
import Loader from "../Loader";
import { tabsTheme } from "../componentTheme/TabsTheme";
import FormItem from "../form/FormItem";
import TableItem from "../table/TableItem";

const TabList = ({ data }: { data: IDatabase }) => {
  const { data: libSpecification, isLoading, isError } = useGetSpecification();

  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа</p>;

  return (
    <Tabs aria-label="Full width tabs" style="fullWidth" theme={tabsTheme}>
      <TabItem title="Өгөгдлийн сангийн мета мэдээлэл">
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
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                1
              </th>
              <td className="px-6 py-2">Хариуцдаг байгууллагын нэр</td>
              <td className="px-6 py-2">{data?.organization?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-2">Өгөгдлийн сангийн тухай ойлголт</td>
              <td className="px-6 py-2">{data?.description}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                3
              </th>
              <td className="px-6 py-2">Зориулалт</td>
              <td className="px-6 py-2">
                {data?.spec?.length > 0 &&
                  data?.spec.map((item, i) => (
                    <div className="m-1" key={i}>
                      <Kbd className=" font-thin text-text-table-small">
                        {libSpecification?.find(
                          (spec: ISpecification) => spec.id == +item.id
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
                4
              </th>
              <td className="px-6 py-2">Зориулалт бусад бичих</td>
              <td className="px-6 py-2">{data?.spec_other}</td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                5
              </th>
              <td className="px-6 py-2">
                Өгөгдлийн сангийн удирдлагын системийн төрөл
              </td>
              <td className="px-6 py-2">{data?.databaseType?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                6
              </th>
              <td className="px-6 py-2">
                Өгөгдлийн сангийн удирдлагын системийн төрөл бусад
              </td>
              <td className="px-6 py-2">{data?.db_type_other}</td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                7
              </th>
              <td className="px-6 py-2">Салбар</td>
              <td className="px-6 py-2">{data?.sectors?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                8
              </th>
              <td className="px-6 py-2">Салбар бусад</td>
              <td className="px-6 py-2">{data?.sector_other}</td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                9
              </th>
              <td className="px-6 py-2">Өгөгдлийн сангийн байршил</td>
              <td className="px-6 py-2">{data?.databaseLocation?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                10
              </th>
              <td className="px-6 py-2">Өгөгдлийн сангийн байршил бусад</td>
              <td className="px-6 py-2">{data?.db_location_other}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                11
              </th>
              <td className="px-6 py-2">
                Нээлттэй өгөгдлийг ашиглах лицензийн төрөл
              </td>
              <td className="px-6 py-2">{data?.licenceType?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                12
              </th>
              <td className="px-6 py-2">
                Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад
              </td>
              <td className="px-6 py-2">{data?.licence_type_other}</td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                13
              </th>
              <td className="px-6 py-2">
                Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж
                болох цахим хуудасны хаяг
              </td>
              <td className="px-6 py-2">
                {data?.opendata_url && (
                  <a
                    className=" text-primary-high text-text-body-small hover:text-primary-default"
                    href={data?.opendata_url}
                  >
                    {data?.opendata_url}
                  </a>
                )}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                14
              </th>
              <td className="px-6 py-2">Өгөгдлийн санг анх нэвтрүүлсэн он</td>
              <td className="px-6 py-2">
              {data?.start_date}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                15
              </th>
              <td className="px-6 py-2">Хүснэгтийн тоо</td>
              <td className="px-6 py-2">{data?.table_count}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                16
              </th>
              <td className="px-6 py-2">Маягттай эсэх</td>
              <td className="px-6 py-2">{data?.is_form ? "Тийм" : "Үгүй"}</td>
            </tr>
          </tbody>
        </table>
      </TabItem>
      <TabItem title={`Хүснэгтийн жагсаалт (${data.tables?.length})`}>
        <div className="flex flex-col gap-4 self-stretch w-full">
          {data.tables?.map((list: ITable, i: number) => {
            return <TableItem list={list} key={i} />;
          })}
        </div>
      </TabItem>
      {data.forms.length > 0 && (
        <TabItem title={`Маягтын жагсаалт (${data.forms?.length})`}>
          <div className="flex flex-col gap-4 self-stretch">
            {data.forms?.map(
              (
                {
                  id,
                  name,
                  code,
                  description,
                  confirmed_date,
                  database: {
                    organization: { name: org_name },
                  },
                  frequency,
                }: any,
                i: any
              ) => {
                return (
                  <FormItem
                    key={i}
                    {...{
                      id,
                      name,
                      description,
                      code,
                      confirmed_date,
                      org_name,
                      frequency,
                    }}
                  />
                );
              }
            )}
          </div>
        </TabItem>
      )}
    </Tabs>
  );
};
export default TabList;
