import React from "react";
import Image from 'next/image';

const HeaderSection = () => (
  
    <header className="header_sec min-[575px]:pt-1 md:pt-0 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto max-w-[1100px] px-[30px] xl:px-0 max-[575px]:px-[15px]">
        <div className="flex justify-between flex-wrap items-center border-b-[2px] border-[#ebebeb]">
          <div className="headerCol w-1/3 max-[575px]:w-1/2">
            <Image src="/logo.png" alt="The Data Breach Advisors Logo" className="w-[190px]" width={190} height={80} />
          </div>
          <div className="headerCol  max-[575px]:w-1/2">
            <Image src="/logo-side.png" alt="The Data Breach Advisors Logo" className="w-[190px]" width={190} height={80} />
          </div>
        </div>
      </div>
    </header>
 

);

export default HeaderSection; 