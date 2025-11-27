import { Box } from "@mui/material";
import { Select } from "@/components/admin/theme/SelectTheme";
import { Option } from "@/components/admin/theme/OptionTheme";

export default function SelectComponent({
  options,
  label,
  onChange,
  defaultValue,
  name,
  errors,
  desabled,
}: any) {
  return (
    <Box
      sx={{
        display: "flex-col",
        alignItems: "center",
        justifyContent: "space-between",
        columnSpan: 2,
        "& > :not(style)": {
          width: "100%",
        },
      }}
    >
      <Select
        value={defaultValue}
        onChange={onChange}
        name={name}
        id={`outlined-select + ${name}`}
        disabled={desabled}
        className={`${desabled && "cursor-not-allowed bg-gray-300"}`}
      >
        {options
          ?.sort((a: any, b: any) => b.id - a.id)
          ?.map((option: any, i: number) => (
            <Option
              key={i}
              value={option.id}
              className={`flex flex-wrap text-wrap text-text-body-medium `}
            >
              {option.name}
            </Option>
          ))}
      </Select>
      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
}
