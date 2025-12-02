import Image from "next/image";
import { isMobile } from "react-device-detect";

const LogoPics = () => {
  return (
    <div className="flex lg:flex-row items-center gap-2">
      <a
        href="/"
        className="-m-1.5 p-1.5 inline-flex flex-col md:flex-row gap-2"
      >
        <span className="hidden lg:inline-flex flex items-center gap-2">
          <Image
            className="object-contain"
            width={isMobile ? 104 : 54}
            height={isMobile ? 104 : 54}
            src="/logo/zg.png"
            alt=""
            quality={100}
            priority
          />
          <span className="text-white text-[16px] font-medium font-extrabold leading-4 w-48">
            Цахим хөгжил, инновац, харилцаа холбооны яам
          </span>
        </span>
        <span className="lg:inline-flex flex items-center gap-2">
          <Image
            className="object-contain"
            width={isMobile ? 54 : 54}
            height={isMobile ? 54 : 54}
            src="/v2/logo1.png"
            alt=""
            quality={100}
            priority
          />
          <span className="text-white text-[16px] font-medium font-extrabold leading-4 w-48">
            Үндэсний Статистикийн Хороо
          </span>
        </span>
      </a>
    </div>
  );
};

export default LogoPics;
