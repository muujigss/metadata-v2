"use client";
import BreadCrumpSubMenu from "@/components/BreadCrumpSubMenu";
import Loader from "@/components/Loader";
import IndicatorDetailSideBar from "@/components/indicator/IndicatorDetailSideBar";
import IndicatorTabList from "@/components/indicator/IndicatorTabList";
import { getIndicator } from "@/services/IndicatorService";
import { useQuery } from "@tanstack/react-query";
import { Card } from "flowbite-react";
import moment from "moment";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";

const IndicatorDetailPage = ({ params }: { params: { id: number } }) => {
  const id = { params }.params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getIndicator by id", id],
    queryFn: () => getIndicator(id),
  });

  if (error) return <p>Алдаа гарлаа ...</p>;
  if (isLoading) return <Loader />;

  if (!data) return <p>Алдаа гарлаа ...</p>;

  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start">
      <BreadCrumpSubMenu data={data} />

      <div className="container py-6 flex overflow-x-auto gap-4">
        <div className="w-1/3 bg-white rounded-lg border ">
          <IndicatorDetailSideBar
            parent_id={data?.table?.db_id}
            tbl_id={data?.tbl_id}
            ind_id={id}
          />
        </div>
        <div className="w-2/3">
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
                  {data?.generated_date &&
                    moment(data?.generated_date).format("YYYY-MM-DD HH:mm")}
                </p>
              </span>
            </div>
            <IndicatorTabList data={data} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndicatorDetailPage;
