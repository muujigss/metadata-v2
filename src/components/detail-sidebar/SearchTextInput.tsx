import { TextInput } from "flowbite-react";
import React from "react";
import { textSubInputTheme } from "../componentTheme/SearchTheme";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";

type ISearchInputProps = {
  dbSearchText: string;
  handleSearchTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchCancel: () => void;
  text: string;
};
const SearchTextInput = ({
  dbSearchText,
  handleSearchTextChange,
  handleSearchCancel,
  text,
}: ISearchInputProps) => {
  return (
    <div className="relative w-full">
      <TextInput
        className="w-full border-0"
        theme={textSubInputTheme}
        id="search"
        type="text"
        placeholder={text}
        value={dbSearchText}
        onChange={handleSearchTextChange}
      />
      <button
        type="submit"
        className="absolute top-0 end-0 p-2 my-1.5 inline-flex items-start text-text-body-small justify-center"
        onClick={handleSearchCancel}
      >
        {dbSearchText === "" ? (
          <SearchLineIcon color="#333a3f" size={16} />
        ) : (
          <CloseLineIcon color="#333a3f" size={16} />
        )}
        <span className="sr-only">Search</span>
      </button>
    </div>
  );
};

export default SearchTextInput;
