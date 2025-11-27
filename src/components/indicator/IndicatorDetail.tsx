"use client";
import React from "react";
import moment from "moment";
import { Card, Kbd } from "flowbite-react";

import { IIndicator } from "@/interfaces/IIndicators";

const IndicatorDetail = ({ data }: { data: IIndicator }) => {
  return (
    <Card className="mx-auto flex self-stretch justify-between mt-2">
      <div className="relative overflow-x-auto ">
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
              <td className="px-6 py-2">Шифр, дугаар</td>
              <td className="px-6 py-2">{data?.code}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-2">
                Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж
              </td>
              <td className="px-6 py-2">
                {data.frequency && data?.frequency.name}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-2">
                Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж Бусад /бичих/
              </td>
              <td className="px-6 py-2">{data.frequency_other}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                3
              </th>
              <td className="px-6 py-2">Хэмжих нэгж</td>
              <td className="px-6 py-2">{data?.unit_id && data?.unit?.name}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                4
              </th>
              <td className="px-6 py-2">Утгын төрөл</td>
              <td className="px-6 py-2">
                {data.value_type_id && data?.value_type?.name}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                5
              </th>
              <td className="px-6 py-2">Нууцын зэрэглэл</td>
              <td className="px-6 py-2">
                {data?.security_level_id && (
                  <Kbd className="font-thin text-text-table-small">
                    {data?.security_level?.name}
                  </Kbd>
                )}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                6
              </th>
              <td className="px-6 py-2">Аргачлал, арга зүй байгаа эсэх</td>
              <td className="px-6 py-2">
                {data?.is_methodology ? "Тийм" : "Үгүй"}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                7
              </th>
              <td className="px-6 py-2">Аргачлал, арга зүйн нэр</td>
              <td className="px-6 py-2">{data?.methodology}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                8
              </th>
              <td className="px-6 py-2">Аргачлал, арга зүйг баталсан эсэх</td>
              <td className="px-6 py-2">
                {data?.is_methodology_confirm ? "Тийм" : "Үгүй"}
              </td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                9
              </th>
              <td className="px-6 py-2">
                Аргачлал, арга зүйг баталсан тушаалын дугаар
              </td>
              <td className="px-6 py-2">{data.methodology_decree_num}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                10
              </th>
              <td className="px-6 py-2">Аргачлал, арга зүйг баталсан огноо</td>
              <td className="px-6 py-2">
                {data?.methodology_date &&
                  moment(data?.methodology_date).format("YYYY-MM-DD")}
              </td>
            </tr>

            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                11
              </th>
              <td className="px-6 py-2">
                Аргачлал, арга зүйг баталсан байгууллага
              </td>
              <td className="px-6 py-2">{data.confirmed_organtization}</td>
            </tr>
            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                12
              </th>
              <td className="px-6 py-2">
                Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он
              </td>
              <td className="px-6 py-2">{data?.generated_date}</td>
            </tr>

            <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
              <th
                scope="row"
                className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
              >
                13
              </th>
              <td className="px-6 py-2">Ангилал, код байгаа эсэх</td>
              <td className="px-6 py-2">
                {data?.is_classification ? "Тийм" : "Үгүй"}
              </td>
            </tr>
            {data.is_classification && (
              <>
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    14
                  </th>
                  <td className="px-6 py-2">
                    Ангиллын тоо /Хэдэн ангилалтай вэ?/
                  </td>
                  <td className="px-6 py-2">{data?.classification_count}</td>
                </tr>
                {/* 
                <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
                  <th
                    scope="row"
                    className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                  >
                    15
                  </th>
                  <td className="px-6 py-2">Ангиллын дугаар</td>
                  <td className="px-6 py-2">
                    <Link href={"/classification/" + data?.classification_id}>
                      <span className=" text-primary-default hover:text-primary-high hover:font-semibold">
                        {data?.classification.classification_name}{" "}
                      </span>
                    </Link>
                  </td>
                </tr> */}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default IndicatorDetail;
