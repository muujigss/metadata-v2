"use client";
import { ISector } from "@/interfaces/ISector";
import { useGetSectors } from "@/utils/customHooks";
import { Card, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
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
import { textInputTheme } from "../componentTheme/SearchTheme";

const SectorList = () => {
  const [searchText, setSearchText] = useState("");
  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };

  const { data: sector } = useGetSectors();
  const filteredData =
    searchText == ""
      ? sector
      : sector.filter((item: ISector) =>
          item?.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  return (
    <div className="container justify-between py-8">
      <div className="flex flex-col items-center justify-start self-stretch gap-4">
        <div className="w-full h-full">
          <TextInput
            theme={textInputTheme}
            id="search"
            type="text"
            rightIcon={searchIcon}
            placeholder="Салбарын нэрээр  хайх..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-full">
          {filteredData?.length == 0 && <p>Хайлтын үр дүнд олдсонгүй ...</p>}
          <div className="flex flex-col gap-4 self-stretch">
            <Swiper
              slidesPerView={isMobile == false ? 5 : 2}
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
              {filteredData
                ?.sort((a: ISector, b: ISector) => a?.feature - b?.feature)
                ?.filter((fdata: ISector) => fdata?.databases?.length > 0)
                ?.map((list: ISector, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <Card
                        className="w-full h-full shadow-tab-border"
                        theme={cardHomeTheme}
                      >
                        <Link href={`/sector/${list?.id}`}>
                          <div className="flex items-center justify-center py-2">
                            <span className="absolute lg:top-4 top-1 px-1 lg:px-2 left-1 lg:left-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                              <Database2FillIcon size={14} color="#fff" />
                              {list?.databases?.length}
                            </span>
                            <span className="absolute top-1 lg:top-4 px-1 lg:px-2 right-1 lg:right-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                              <GridLineIcon size={14} color="#fff" />
                              {list?.databases?.length > 0
                                ? list?.databases?.reduce(
                                    (a, b) => a + b.table_count,
                                    0
                                  )
                                : 0}
                            </span>
                            <Image
                              className="shrink-0 object-cover rounded-full shadow shadow-primary-medium border-1 border-surface-default"
                              src={
                                !!list?.img_url
                                  ? list?.img_url
                                  : "logo/no-image.png"
                              }
                              alt={list?.name}
                              width={100}
                              height={100}
                              quality={100}
                            />
                          </div>
                          <div
                            className={`flex items-center justify-center py-2 text-center`}
                          >
                            <span className="text-text-body-small lg:text-text-body-large font-medium lg:font-semibold text-secondary-medium truncate leading-3 lg:leading-5 text-wrap">
                              {list?.name}
                            </span>
                          </div>
                        </Link>
                      </Card>
                    </SwiperSlide>
                  );
                })
                .slice(0, 7)}
            </Swiper>
            <Swiper
              slidesPerView={isMobile == false ? 5 : 2}
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
              {filteredData
                ?.sort((a: ISector, b: ISector) => a?.feature - b?.feature)
                ?.filter((fdata: ISector) => fdata?.databases?.length > 0)
                ?.map((list: ISector, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <Card
                        className="w-full h-full shadow-tab-border"
                        theme={cardHomeTheme}
                      >
                        <Link href={`/sector/${list?.id}`}>
                          <div className="flex items-center justify-center py-2">
                            <span className="absolute lg:top-4 top-1 px-1 lg:px-2 left-1 lg:left-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                              <Database2FillIcon size={14} color="#fff" />
                              {list?.databases?.length}
                            </span>
                            <span className="absolute top-1 lg:top-4 px-1 lg:px-2 right-1 lg:right-4 inline-flex items-center justify-center gap-1 lg:gap-2 text-text-body-medium bg-primary-default text-white rounded-lg w-auto">
                              <GridLineIcon size={14} color="#fff" />
                              {list?.databases?.length > 0
                                ? list?.databases?.reduce(
                                    (a, b) => a + b.table_count,
                                    0
                                  )
                                : 0}
                            </span>
                            <Image
                              className="shrink-0 object-cover rounded-full shadow shadow-primary-medium border-1 border-surface-default"
                              src={
                                !!list?.img_url
                                  ? list?.img_url
                                  : "logo/no-image.png"
                              }
                              alt={list?.name}
                              width={100}
                              height={100}
                              quality={100}
                            />
                          </div>
                          <div
                            className={`flex items-center justify-center py-2 text-center`}
                          >
                            <span className="text-text-body-small lg:text-text-body-large font-medium lg:font-semibold text-secondary-medium truncate leading-3 lg:leading-5 text-wrap">
                              {list?.name}
                            </span>
                          </div>
                        </Link>
                      </Card>
                    </SwiperSlide>
                  );
                })
                .slice(7, filteredData?.length)}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorList;
