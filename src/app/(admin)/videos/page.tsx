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

const VideosPage = () => {
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              textTransform: "uppercase",
            }}
            color="primary"
          >
            Видео заавар
          </Typography>
          <Grid2 container spacing={2}>
            {videoData.map((item, index) => {
              return (
                <Grid2
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", p: 0.5 }}
                  >
                    <Typography variant="body1">
                      {index + 1}. {item.name}
                    </Typography>
                    <iframe
                      src={item.link}
                      width="100%"
                      height="360"
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    />
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </CardContent>
    </Box>
  );
};

export default VideosPage;
