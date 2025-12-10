"use client";
import { useState, useEffect, useRef } from "react";
import Result from "./Result";
import axios from "axios";
import Loader from "../Loader";
import { Card, TextInput } from "flowbite-react";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { textInputHomeSearchTheme } from "../componentTheme/SearchTheme";
import { cardTheme } from "../componentTheme/CardTheme";

export default function Index() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        performSearch(query);
      } else {
        setData({});
        setShowResults(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    setShowResults(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      setData(response.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setData({});
    setShowResults(false);
  };

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={18} />;
  };

  return (
    <div className="relative w-full py-6" ref={searchRef}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Хайх
      </label>
      <div className="relative">
        <TextInput
          theme={textInputHomeSearchTheme}
          className="w-full shadow-md"
          icon={searchIcon}
          id="default-search"
          type="text"
          value={query}
          placeholder="Өгөгдлийн сан, хүснэгт, үзүүлэлт, ангилал болон маягтаас хайх..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length > 1) setShowResults(true);
          }}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 p-2 my-auto inline-flex items-center justify-center mr-2 text-gray-400 hover:text-gray-600"
            onClick={handleClearSearch}
          >
            <CloseLineIcon size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-2 transition-all duration-200 ease-in-out transform origin-top">
          <Card
            theme={cardTheme}
            className="max-h-[600px] overflow-y-auto border-t-2 border-t-primary-default shadow-2xl bg-[#111827] border-gray-700"
          >
            {loading ? (
              <div className="w-full text-center py-10 flex flex-col items-center justify-center text-gray-500">
                <Loader />
                <p className="mt-3 text-sm">Хайж байна...</p>
              </div>
            ) : (
              <Result data={data} query={query} />
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
