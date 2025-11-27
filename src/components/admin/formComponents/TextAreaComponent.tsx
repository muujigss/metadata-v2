import { Box } from "@mui/material";
import { TextAreaTheme } from "../theme/TextAreaTheme";

const TextAreaComponent = ({
  onChange,
  label,
  type,
  name,
  value,
  errors,
  desabled,
}: {
  onChange: any;
  label: string;
  type: string;
  name: string;
  value?: any;
  errors?: any;
  desabled?: any;
}) => {
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
      <TextAreaTheme
        aria-multiline
        maxRows={4}
        id={`"outlined-multiline-${name}"`}
        placeholder={label}
        name={name}
        value={value}
        onChange={onChange}
        minRows={2}
        disabled={desabled}
        className={`${desabled && "cursor-not-allowed bg-gray-300"}`}
      />
      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
};

export default TextAreaComponent;
