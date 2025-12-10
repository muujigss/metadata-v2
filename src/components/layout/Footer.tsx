import Image from "next/image";
import Link from "next/link";


const Footer = () => {
  return (
    <footer className="relative bg-[#080812] w-full h-[600px] pt-[100px]">
      <div className="absolute inset-0 -top-[920px] bg-[url('/v2/bg-pattern-wave2.png')] bg-cover bg-no-repeat z-0"></div>
      <div className="relative z-10 bg-[rgba(61,78,108,0.15)] rounded-lg container m-auto text-center py-4 px-40 h-[400px] flex">
        <div className="w-full flex justify-between items-center px-10">
          {/* Left: Ministry */}
          <div className="flex flex-col items-start gap-4 w-1/3">
            <Link
              href="https://mddic.gov.mn"
              target="_blank"
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
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
            </Link>
          </div>

          {/* Center: e-Mongolia */}
          <div className="flex justify-center w-1/3">
            <Link href="https://e-mongolia.mn/" target="_blank">
              <Image
                src="/logo/E-Mongolia_Logo.png"
                alt="e-Mongolia"
                width={280}
                height={112}
                className="object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Right: 1212.mn */}
          <div className="flex flex-col items-center justify-center w-1/3 h-full">
            <Link
              href="https://www.1212.mn"
              target="_blank"
              className="text-white text-[36px] font-medium leading-tight hover:opacity-80 transition-opacity"
            >
              www.1212.mn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
