"use client";
import Link from "next/link";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import Building4LineIcon from "remixicon-react/Building4LineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";

const StatComponent = ({ mainIndicator }: { mainIndicator: any }) => {
  const list = [
    {
      title: "Байгууллага",
      description: "Бүртгэлтэй байгууллагын мэдээлэл",
      icon: <Building4LineIcon size={24} color="white" />,
      link: "/organization",
      count: mainIndicator?.organizations,
    },
    {
      title: "Өгөгдлийн сан",
      description: "Төрийн байгууллагын өгөгдлийн сангийн мета мэдээлэл",
      icon: <Database2FillIcon size={24} color="white" />,
      link: "/database",
      count: mainIndicator?.databases,
    },
    {
      title: "Хүснэгт",
      description: "Өгөгдлийн санд агуулагдаж буй үндсэн хүснэгтийн мета мэдээлэл",
      icon: <GridLineIcon size={24} color="white" />,
      link: "/table",
      count: mainIndicator?.tables,
    },
    {
      title: "Үзүүлэлт",
      description: "Үндсэн хүснэгтийн үзүүлэлтийн мета мэдээлэл",
      icon: <PulseLineIcon size={24} color="white" />,
      link: "/indicator",
      count: mainIndicator?.indicators,
    },
    {
      title: "Ангилал, код",
      description: "Үндсэн хүснэгтийн ангилал, кодын мета мэдээлэл",
      icon: <BarcodeBoxLineIcon size={24} color="white" />,
      link: "/classification",
      count: mainIndicator?.classifications,
    },
    {
      title: "Маягт",
      description: "Маягтын мета мэдээлэл",
      icon: <EditBoxFillIcon size={24} color="white" />,
      link: "/form",
      count: mainIndicator?.forms,
    },
  ]
  return (
    <div className="relative bg-[#080812]">
      <div className="absolute inset-0 bg-[url('/v2/bg-pattern.png')] bg-cover bg-no-repeat z-0"></div>
      <div className="grid container mx-auto py-14 px-8 pt-[100px] relative z-10">
        <h5 className="flex justify-center text-white font-medium font-sans text-[38px]">Ангилал</h5>
        <div className="w-full pt-[50px]">
          <ul className="flex flex-col lg:grid lg:grid-cols-2 justify-between gap-4 ">
            {
              list.map((item: any, i: number) => {
                return (
                  <li key={i} className="py-3 sm:py-4 px-4 bg-[rgba(61,78,108,0.15)] backdrop-blur-lg rounded-lg bg-[url('/v2/bg-pattern-wave.png')] bg-cover bg-no-repeat">
                    <Link href={item.link}>
                      <div className="flex items-center space-x-4 w-full">
                        <div className="shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1 items-center">
                          <p className="uppercase text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="truncate text-white text-justify opacity-80 ">
                            {item.description}
                          </p>
                        </div>
                        <div className="inline-flex bg-white text-white justify-center items-center rounded-full bg-primary-10 w-10 h-10 lg:h-12 lg:w-12">
                          <span className="text-[#080812] lg:text-text-body-medium">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
export default StatComponent;
