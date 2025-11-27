import { Badge } from "flowbite-react";
import Link from "next/link";
import FacebookFillIcon from "remixicon-react/FacebookFillIcon";
import InstagramLineIcon from "remixicon-react/InstagramLineIcon";
import YoutubeLineIcon from "remixicon-react/YoutubeLineIcon";

const Footer = () => {
  return (
    <footer className="  bg-white  ">
      <div className="container m-auto text-center p-4 md:p-8 lg:p-10">
        <div className="flex flex-wrap md:flex-row items-center gap-2 py-14">
          <span className="inline-flex gap-2 items-center px-2">
            <h3 className="font-bold col-span-2 text-xl uppercase">
              Үндэсний статистикийн хороо ©2024
            </h3>
          </span>
          <ul className="flex flex-auto justify-start md:justify-end gap-3 item-center">
            <li>
              <Link
                href={"https://www.facebook.com/StatisticMGL"}
                target="_blank"
              >
                <FacebookFillIcon />
              </Link>
            </li>
            <li>
              <Link
                href={"https://www.youtube.com/@user-kz7vr8ke8k"}
                target="_blank"
              >
                <YoutubeLineIcon />
              </Link>
            </li>
            <li>
              <Link
                href={
                  "https://www.instagram.com/statisticsmgl?igsh=c2ljNm41dGxuMXdl"
                }
                target="_blank"
              >
                <InstagramLineIcon />
              </Link>
            </li>
            <li>
              <Link href={"https://1212.mn/"} target="_blank">
                <h3 className="font-bold col-span-2 text-xl uppercase">
                  www.1212.mn
                </h3>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
