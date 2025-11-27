import { Box } from "@mui/material";
import { MultiSelect } from "../theme/MulteSelectTheme";
import { Option } from "../theme/OptionTheme";

export default function MultiSelectComponent({
  options,
  label,
  value,
  onChange,
  name,
  errors,
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
      <MultiSelect
        value={value}
        onChange={onChange}
        name={name}
        id={`outlined-select + ${name}`}
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
      </MultiSelect>
      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
}
