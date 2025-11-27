"use client";
import { ISector } from "@/interfaces/ISector";
import { getSector } from "@/services/SectorService";
import { useQuery } from "@tanstack/react-query";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import ArrowRightCircleLineIcon from "remixicon-react/ArrowRightCircleLineIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cardHomeTheme } from "../componentTheme/CardHomeTheme";
import Loader from "../Loader";
export const revalidate = 3600;

const SectorSlide = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetch sector slide data"],
    queryFn: () => getSector(),
    refetchOnWindowFocus: true,
  });

  if (isError) return <p>Алдаа гарлаа!</p>;
  if (isLoading) return <Loader />;

  return (
    <div
      className="mt-16"
      style={{
        background:
          "linear-gradient(340deg,#f6fbfb 0.72%,#d7def6 59.53%,#efd8d8 98.91%)",
      }}
    >
      <div className="container mx-auto p-8">
        <div className="flex flex-wrap items-center justify-between pb-0 lg:pb-8 gap-2">
          <h5 className="uppercase text-text-home-title">Салбар</h5>
          <Link
            href="/sector"
            className="text-text-body-medium uppercase text-secondary-default hover:underline hover:text-primary-medium"
          >
            <span className="inline-flex items-center hover:border-b-2 hover:border-primary-medium">
              Бүх салбар харах
              <ArrowRightCircleLineIcon className="mx-2" size={18} />
            </span>
          </Link>
        </div>
        <Swiper
          slidesPerView={isMobile == false ? 4 : 2}
          spaceBetween={30}
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 2,
            slideShadows: false,
          }}
          effect={"coverflow"}
          className="mySwiper py-8"
        >
          {data
            ?.sort((a: ISector, b: ISector) => a?.feature - b?.feature)
            ?.filter((fdata: ISector) => fdata?.databases?.length > 0)
            ?.map((sData: ISector, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <Card
                    className="w-full h-full shadow-tab-border"
                    theme={cardHomeTheme}
                  >
                    <Link href={`/sector/${sData?.id}`}>
                      <div className="flex items-center justify-center py-2">
                        <span className="absolute lg:top-4 top-1 px-1 lg:px-2 left-1 lg:left-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                          <Database2FillIcon size={14} color="#fff" />
                          {sData?.databases?.length}
                        </span>
                        <span className="absolute top-1 lg:top-4 px-1 lg:px-2 right-1 lg:right-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                          <GridLineIcon size={14} color="#fff" />
                          {sData?.databases?.length > 0
                            ? sData?.databases?.reduce(
                                (a, b) => a + b.table_count,
                                0
                              )
                            : 0}
                        </span>
                        <Image
                          className="shrink-0 object-cover rounded-full shadow shadow-primary-medium border-1 border-surface-default"
                          src={
                            !!sData?.img_url
                              ? sData?.img_url
                              : "logo/no-image.png"
                          }
                          alt={sData?.name}
                          width={isMobile == false ? 100 : 50}
                          height={isMobile == false ? 100 : 50}
                          quality={100}
                        />
                      </div>
                      <div
                        className={`flex items-center justify-center py-2 text-center`}
                      >
                        <span className="text-text-body-small lg:text-text-body-large font-medium lg:font-semibold text-secondary-medium truncate leading-3 lg:leading-5 text-wrap">
                          {sData?.name}
                        </span>
                      </div>
                    </Link>
                  </Card>
                </SwiperSlide>
              );
            })
            .slice(0, 6)}
        </Swiper>
        <Swiper
          slidesPerView={isMobile == false ? 4 : 2}
          spaceBetween={30}
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 2,
            slideShadows: false,
          }}
          effect={"coverflow"}
          className="mySwiper"
        >
          {data
            ?.sort((a: ISector, b: ISector) => a?.feature - b?.feature)
            ?.filter((fdata: ISector) => fdata?.databases?.length > 0)
            ?.map((sData: ISector, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <Card
                    className="w-full h-full shadow-tab-border"
                    theme={cardHomeTheme}
                  >
                    <Link href={`/sector/${sData?.id}`}>
                      <div className="flex items-center justify-center py-2">
                        <span className="absolute lg:top-4 top-1 px-1 lg:px-2 left-1 lg:left-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                          <Database2FillIcon size={14} color="#fff" />
                          {sData?.databases?.length}
                        </span>
                        <span className="absolute top-1 lg:top-4 px-1 lg:px-2 right-1 lg:right-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                          <GridLineIcon size={14} color="#fff" />
                          {sData?.databases?.length > 0
                            ? sData?.databases?.reduce(
                                (a, b) => a + b?.table_count,
                                0
                              )
                            : 0}
                        </span>
                        <Image
                          className="shrink-0 object-cover rounded-full shadow shadow-primary-medium border-1 border-surface-default"
                          src={
                            !!sData?.img_url
                              ? sData?.img_url
                              : "logo/no-image.png"
                          }
                          alt={sData?.name}
                          width={isMobile == false ? 100 : 50}
                          height={isMobile == false ? 100 : 50}
                          quality={100}
                        />
                      </div>
                      <div
                        className={`flex items-center justify-center py-2 text-center`}
                      >
                        <span className="text-text-body-small lg:text-text-body-large font-medium lg:font-semibold text-secondary-medium truncate leading-3 lg:leading-5 text-wrap">
                          {sData?.name}
                        </span>
                      </div>
                    </Link>
                  </Card>
                </SwiperSlide>
              );
            })
            .slice(6, 14)}
        </Swiper>
      </div>
    </div>
  );
};
export default SectorSlide;
