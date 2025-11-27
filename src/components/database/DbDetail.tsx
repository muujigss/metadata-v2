"use client";
import { getOneDatabase } from "@/services/DatabaseService";
import { useQuery } from "@tanstack/react-query";
import { Card } from "flowbite-react";
import moment from "moment";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import BreadCrumpSubMenu from "../BreadCrumpSubMenu";
import Loader from "../Loader";
import DbDetailSideBar from "./DbDetailSideBar";
import TabList from "./Tablist";

const DbDetail = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch database one list, id", id],
    queryFn: () => getOneDatabase(id),
    refetchOnWindowFocus: true,
  });

  if (error) return <p>Ачааллаж байна ...</p>;
  if (isLoading) return <Loader />;
  if (!data) return <p>Ачааллаж байна ...</p>;

  return (
    <>
      <div className="flex min-h-screen flex-col items-start justify-start w-full">
        <BreadCrumpSubMenu data={data} />
        <div className="container py-6 flex flex-col md:flex-row overflow-x-auto gap-6">
          <div className="w-1/3 bg-white border rounded-lg">
            <DbDetailSideBar
              parent_id={data && data?.org_id}
              database_id={id}
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
                  {data?.start_date}
                  </p>
                </span>
              </div>
              <TabList data={data} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DbDetail;
