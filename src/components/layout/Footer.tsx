import Image from "next/image";
import Link from "next/link";
import FacebookFillIcon from "remixicon-react/FacebookFillIcon";
import InstagramLineIcon from "remixicon-react/InstagramLineIcon";
import YoutubeLineIcon from "remixicon-react/YoutubeLineIcon";

const Footer = () => {
  return (
    <footer className="relative bg-[#080812] w-full h-[600px] pt-[100px]">
      <div className="absolute inset-0 -top-[920px] bg-[url('/v2/bg-pattern-wave2.png')] bg-cover bg-no-repeat z-0"></div>
      <div className="bg-[rgba(61,78,108,0.15)] rounded-lg container m-auto text-center py-4 px-40 h-[400px] flex">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="lg:inline-flex flex items-center gap-5 justify-start">
            <Image
              className="object-contain"
              width={113}
              height={113}
              src="/v2/logo1.png"
              alt=""
              quality={100}
              priority
            />
            <h3 className="text-white text-[32px] font-medium leading-10 w-[330px] text-left">
              Үндэсний Статистикийн Хороо
            </h3>
          </div>
          <div className="flex flex-col gap-5 items-end">
            <div className="flex gap-3">
              <Link
                  href={"https://www.facebook.com/StatisticMGL"}
                  target="_blank"
                >
                <FacebookFillIcon color="white" />
              </Link>
              <Link
                href={"https://www.youtube.com/@user-kz7vr8ke8k"}
                target="_blank"
              >
                <YoutubeLineIcon color="white" />
              </Link>
              <Link
                href={
                  "https://www.instagram.com/statisticsmgl?igsh=c2ljNm41dGxuMXdl"
                }
                target="_blank"
              >
                <InstagramLineIcon color="white" />
              </Link>
            </div>
            <div>
              <Link href={"https://1212.mn/"} target="_blank">
                <h3 className="col-span-2 text-white text-[27px] italic font-bold">
                  www.1212.mn
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
