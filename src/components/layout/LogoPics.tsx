import Image from "next/image";
import { isMobile } from "react-device-detect";

const LogoPics = () => {
  return (
    <div className="flex lg:flex-row items-center gap-2">
      <a
        href="/"
        className="-m-1.5 p-1.5 inline-flex flex-col md:flex-row gap-2"
      >
        <span className="sr-only">Үндэсний Статистикийн Хороо</span>
        <Image
          className="object-contain"
          width={isMobile ? 150 : 200}
          height={isMobile ? 150 : 200}
          src="/logo.png"
          alt=""
          quality={100}
          priority
        />
        <span className="hidden lg:inline-flex items-center gap-2">
          <Image
            className="object-contain"
            width={isMobile ? 30 : 54}
            height={isMobile ? 30 : 54}
            src="/logo/zg.png"
            alt=""
            quality={100}
            priority
          />
          <span className="text-text-organization-small text-primary-default font-extrabold leading-4 w-48 uppercase">
            Цахим хөгжил, инновац, харилцаа холбооны яам
          </span>
        </span>
      </a>
    </div>
  );
};

export default LogoPics;
