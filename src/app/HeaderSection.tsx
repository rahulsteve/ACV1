import React from "react";
import Image from 'next/image';

const HeaderSection = () => (
  
    <header className="header_sec pt-1 md:pt-0 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto max-w-[1100px] px-[30px] xl:px-0 max-[575px]:px-[15px]">
        <div className="flex justify-between flex-wrap items-center border-b-2 border-[#ebebeb] py-[11px]">
          <div className="headerCol w-1/3 max-[575px]:w-1/2">
            <Image
              src="/public/file.svg"
              alt="Logo"
              width={40}
              height={40}
              className=" w-[300px]"
            />
          </div>
        </div>
      </div>
    </header>
 

);

export default HeaderSection; 