"use client";
import BreadCrumpSubMenu from "@/components/BreadCrumpSubMenu";
// import DetailSideBar from "@/components/detail-sidebar/DetailSideBar";
import Loader from "@/components/Loader";
import TableDetailSideBar from "@/components/table/TableDetailSideBar";

import TableTabList from "@/components/table/TableTabList";
import { ITable } from "@/interfaces/ITable";
import { getTable } from "@/services/TableService";
import { useQuery } from "@tanstack/react-query";
import { Card } from "flowbite-react";
import moment from "moment";
import { Suspense } from "react";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";

const TablePage = ({ params }: { params: { id: number } }) => {
  const id = { params }.params.id;
  const { data, isLoading, error } = useQuery<ITable | undefined>({
    queryKey: ["table details id", id],
    queryFn: () => getTable(id),
  });

  if (error) return <p>Алдаа гарлаа ...</p>;
  if (isLoading) return <Loader />;

  if (data == null) return <p>Дээрх хүснэгтийн дугаар олдсонгүй! ...</p>;

  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start ">
      {/* <BreadCrumpMenu
        menu_name="Хүснэгт"
        id={2}
        submenu_id={id}
        submenu_name={data?.tbl_name}
      /> */}
      <BreadCrumpSubMenu data={data} />
      <div className="container py-6 flex overflow-x-auto gap-4">
        <div className="w-1/3 bg-white rounded-lg border">
          {/* <DetailSideBar parent_id={data.db_id} tbl_id={data?.id} /> */}
          <TableDetailSideBar parent_id={data.db_id} tbl_id={data?.id} />
        </div>
        <div className="w-2/3">
          <Suspense fallback={<Loader />}>
            <Card className="flex self-stretch justify-between mx-auto ">
              <div className="relative overflow-x-auto ">
                <div
                  className="text-black mb-2 font-bold"
                  style={{ fontSize: 24 }}
                >
                  {data?.name}
                </div>
                <span className=" text-text-body-medium2 text-secondary-default opacity-50 inline-flex items-center px-2 pb-4">
                  <Calendar2LineIcon size={14} color="#333a3f" />
                  <p className="px-2">
                  {data?.started_date}
                  </p>
                </span>
              </div>
              <TableTabList data={data} />
            </Card>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
