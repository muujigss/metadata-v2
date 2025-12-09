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
        <div className="w-full flex justify-between items-center px-10">
          {/* Left: Ministry */}
          <div className="flex flex-col items-start gap-4 w-1/3">
            <div className="flex items-center gap-4">
              <Image
                className="object-contain"
                width={80}
                height={80}
                src="/logo/zg.png"
                alt="Ministry Logo"
                quality={100}
                priority
              />
              <h3 className="text-white text-[20px] font-medium leading-tight text-left">
                Цахим хөгжил, инновац, <br />
                харилцаа холбооны яам
              </h3>
            </div>
          </div>

          {/* Center: e-Mongolia */}
          <div className="flex justify-center w-1/3">
            <Image
              src="/logo/E-Mongolia_Logo.png"
              alt="e-Mongolia"
              width={280}
              height={112}
              className="object-contain"
            />
          </div>

          {/* Right: Socials */}
          <div className="flex flex-col items-end gap-5 w-1/3">
            <div className="flex gap-4">
              <Link
                href={"https://www.facebook.com/StatisticMGL"}
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <FacebookFillIcon color="white" size={32} />
              </Link>
              <Link
                href={"https://www.youtube.com/@user-kz7vr8ke8k"}
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <YoutubeLineIcon color="white" size={32} />
              </Link>
              <Link
                href={
                  "https://www.instagram.com/statisticsmgl?igsh=c2ljNm41dGxuMXdl"
                }
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <InstagramLineIcon color="white" size={32} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
