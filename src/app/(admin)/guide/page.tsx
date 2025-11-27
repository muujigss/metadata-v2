"use client";
import { Grid2 } from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Alert } from "flowbite-react";
import Link from "next/link";

import React from "react";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import FileExcelLineIcon from "remixicon-react/FileExcelLineIcon";
const post = {
  id: "1",

  category: "Travel",
  title: "Traveling to Canada",
  date: "2 min ago",
};

const videoData = [
  {
    name: "Өгөгдлийн сан",
    link: "https://player.cloudinary.com/embed/?public_id=Guide%20files%2Fjai4lldghdae9kczuvro&cloud_name=djv1wgfyh&player[showLogo]=false",
  },
  {
    name: "Хүснэгт",
    link: "https://player.cloudinary.com/embed/?public_id=Guide%20files%2Fi3axsp1cye5zjh6onfew&cloud_name=djv1wgfyh&player[showLogo]=false",
  },
  {
    name: "Маягт",
    link: "https://player.cloudinary.com/embed/?public_id=Guide%20files%2Fpgog8zwzqb2zxmtt4zmo&cloud_name=djv1wgfyh&player[showLogo]=false",
  },
  {
    name: "Үзүүлэлт",
    link: "https://player.cloudinary.com/embed/?public_id=Guide%20files%2Fbry49t6esdhazut2ef85&cloud_name=djv1wgfyh&player[showLogo]=false",
  },
  {
    name: "Ангилал, код",
    link: "https://player.cloudinary.com/embed/?public_id=Guide%20files%2Fmqekfooinzxjbuxh4ztl&cloud_name=djv1wgfyh&player[showLogo]=false",
  },
];

const GuidePage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Box sx={{ width: "100%", backgroundColor: "#fff" }}>
      {isLoading && (
        <>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={440}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius / 5,
            }}
          ></Skeleton>
        </>
      )}

      <CardContent>
        <Grid2
          width={"80%"}
          container={true}
          display={"flex"}
          direction={"column"}
          justifyContent={"center"}
        >
          <Typography variant="h5" mb={1}>
            Системийн зорилго
          </Typography>
          <Divider />
          <Box my={1}>
            <Typography variant="body1">
              Энэхүү цахим хуудас нь төрийн байгууллагуудын үүсгэсэн өгөгдлийг
              багц (мэдээллийн сан), хүснэгт, үзүүлэлт, ангилал, код, тэдгээрийг
              цуглуулж байгаа маягт, асуулгын хуудасны мета элементүүдийг
              харуулах, өгөгдлийн сангийн үзүүлэлт, түүнд ашиглаж байгаа
              ангилал, кодын уялдааг харах зорилготой.
            </Typography>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Typography variant="h6">Мета мэдээлэл оруулах хэсэг</Typography>
          <Alert color="info">
            <Typography variant="body1">
              1. Өгөгдлийн сангийн мета мэдээлэл үүсгэнэ
            </Typography>
          </Alert>
          <Alert color="info">
            <Typography variant="body1">
              2. Хүснэгт/Маягт-ын мета мэдээлэл үүсгэнэ
            </Typography>
          </Alert>
          <Alert color="info">
            <Typography variant="body1">
              3. Үзүүлэлтийн мета мэдээлэл үүсгэнэ
            </Typography>
          </Alert>
          <Alert color="info">
            <Typography variant="body1">
              4. Ангилал, кодын мета мэдээлэл үүсгэнэ.
            </Typography>
          </Alert>

          <Box my={2}>
            <Divider />
          </Box>
          <Box my={2}>
            <Typography variant="h5" color="red">
              Анхаарах зүйлс
            </Typography>
            <Alert color="info">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ErrorWarningLineIcon color="orange" size={32} />
                <Typography variant="body1">
                  Ангилал, кодын мэдээлэл оруулахдаа ерөнхий мета мэдээлэл
                  оруулна. Дараа нь бэлтгэсэн загварын дагуу ангилал, кодыг
                  бэлтгэн upload хийнэ.
                  <Link
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    target="_blank"
                    href="https://res.cloudinary.com/djv1wgfyh/raw/upload/v1728283814/Guide%20files/wyqb4e5axwvviwjunney.xlsx"
                  >
                    <FileExcelLineIcon color="green" />
                    <Typography variant="body1">Загвар файл татах</Typography>
                  </Link>
                </Typography>
              </Box>
            </Alert>
            <Alert color="info">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ErrorWarningLineIcon color="orange" size={32} />
                <Typography variant="body1">
                  Маягтын файлыг оруулахдаа PDF файл оруулна.
                </Typography>
              </Box>
            </Alert>
            <Alert color="info">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ErrorWarningLineIcon color="orange" size={32} />
                <Typography variant="body1">
                  Хэрвээ огноо оруулах хэсэгт зөвхөн он (2009) байгаа бол тухайн
                  оны эхний 1-р сарын 1-ныг авна.
                </Typography>
              </Box>
            </Alert>
          </Box>
        </Grid2>
      </CardContent>
    </Box>
  );
};

export default GuidePage;
