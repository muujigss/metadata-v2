import { Box, Typography } from "@mui/material";
import Link from "next/link";

const JuramPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            display: "flex",
          }}
          variant="h6"
        >
          ЖУРАМ
        </Typography>
        <Link
          href={
            "https://res.cloudinary.com/djv1wgfyh/raw/upload/v1730782148/Guide files/wuvjb3cfkywociu0tn8p.docx"
          }
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textTransform: "lowercase",
              ":first-letter": {
                textTransform: "capitalize",
              },
            }}
            color="primary.dark"
          >
            СУУРЬ БОЛОН ТӨРӨЛЖСӨН МЭДЭЭЛЛИЙН САНГ ЦАХИМ ХЭЛБЭРЭЭР ШИНЭЭР ҮҮСГЭХ,
            БҮТЦИЙН ӨӨРЧЛӨЛТ ОРУУЛАХ, АШИГЛАЛТААС ГАРГАХ НӨХЦӨЛ, БҮРТГҮҮЛЭХ
            ЖУРАМ
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default JuramPage;
