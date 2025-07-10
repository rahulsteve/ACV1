import React from "react";

const HeaderSection = () => (
  
    <header className="header_sec min-[575px]:pt-1 md:pt-0 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto max-w-[1100px] px-[30px] xl:px-0 max-[575px]:px-[15px]">
        <div className="flex justify-between flex-wrap items-center border-b-[2px] border-[#ebebeb] py-[10px] pb-[13px]">
          <div className="headerCol w-1/3 max-[575px]:w-1/2">
            <img
              src="https://quiz-live.s3.amazonaws.com/upload/cavis-limited/tdba-logo-3-1743052888228.png"
              alt="The Data Breach Advisors Logo"
              className=" w-[300px]"
            />
          </div>
        </div>
      </div>
    </header>
 

);

export default HeaderSection; 