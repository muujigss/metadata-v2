"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { textSubInputTheme } from "@/components/componentTheme/SearchTheme";

export default function ClientSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initial = searchParams.get("query") ?? "";
  const [searchText, setSearchText] = useState(initial);

  const updateQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("query", value);
    else params.delete("query");
    params.delete("page");
    router.push("?" + params.toString());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateQuery(searchText);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <div className="w-full md:w-1/3 pb-4">
      <div className="relative w-full">
        <TextInput
          className="w-full py-1.5"
          theme={textSubInputTheme}
          placeholder="Өгөгдлийн сангийн нэрээр хайх..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          color="grey"
          size="xs"
          onClick={() => setSearchText("")}
          className="absolute top-0 right-0 p-2 my-1"
        >
          {searchText ? <CloseLineIcon size={16} /> : <SearchLineIcon size={16} />}
        </Button>
      </div>
    </div>
  );
}
