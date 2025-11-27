"use client";
import { useState } from "react";
import Result from "./Result";
import axios from "axios";
import Loader from "../Loader";
import { Card, TextInput } from "flowbite-react";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { textInputHomeSearchTheme } from "../componentTheme/SearchTheme";
import { cardTheme } from "../componentTheme/CardTheme";

export default function Index() {
  const [changes, setChanges] = useState(true);
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const Search = async (value: any) => {
    setLoading(true);
    let data = JSON.stringify({
      values: value,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/elastic",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      await axios.request(config).then((response) => {
        const resdata = JSON.parse(response.data.response);
        const groupedData = resdata.hits.hits.reduce((acc: any, item: any) => {
          if (item.highlight) {
            const key = item._source._type;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
          }
          return acc;
        }, {});
        setData(groupedData);
        setLoading(false);
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={18} />;
  };

  const handleSearchChange = (event: any) => {
    var trData = event.target.value.trim();
    setSearch(event.target.value);

    if (trData.length > 2) {
      Search(trData);
      setChanges(false);
    } else {
      setData({});
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setChanges(true);
  };
  return (
    <>
      {/* <form action="/data" method='get'> */}
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Хайх
      </label>
      <div className="relative w-full py-6">
        <TextInput
          theme={textInputHomeSearchTheme}
          className="w-full"
          icon={searchIcon}
          id="default-search"
          type="text"
          value={search}
          placeholder="Өгөгдлийн сан, хүснэгт, үзүүлэлт, ангилал болон маягтаас хайх ..."
          onChange={handleSearchChange}
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-2 p-2 my-2 inline-flex items-center text-text-body-small justify-center"
          onClick={handleClearSearch}
        >
          {search !== "" && <CloseLineIcon color="#005baa" size={18} />}
        </button>
        {search.length > 2 && (
          <div id="style-1" className="w-full h-full pt-1">
            <Card
              theme={cardTheme}
              className={
                "z-20 overflow-y-scroll absolute w-full h-96 border-transparent border-t-2 border-t-primary-default rounded-sm bg-white p-4 " +
                `${(changes && " invisible") || (search == "" && " invisible")}`
              }
              style={{ boxShadow: "0px 15px 20px #b3b3b3" }}
            >
              {loading ? (
                <div
                  className="w-full text-center"
                  style={{ paddingTop: "13%" }}
                >
                  <Loader />
                  <p className="pb-4">Уншиж байна.</p>
                </div>
              ) : (
                <Result data={data} />
              )}
            </Card>
          </div>
        )}
      </div>
      {/* </form> */}
    </>
  );
}
