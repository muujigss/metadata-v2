import { Box, Button, Tooltip } from "@mui/material";
import QuestionLineIcon from "remixicon-react/QuestionLineIcon";

const TooltipComponent = ({ content }: { content: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      <Tooltip title={content}>
        <Button>
          <QuestionLineIcon size={18} color="gray" />
        </Button>
      </Tooltip>
    </Box>
  );
};

export default TooltipComponent;
