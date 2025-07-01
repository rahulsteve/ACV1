import React from "react";
 
const InfoBarSection = () => (
  <section className="w-full
  bg-[#fff41f]
  border-b-2
  border-[#f5e900]
  mt-[50px]
  pt-[40px]
  pb-[20px]">
    <div className="max-w-[800px] mx-auto px-4">
      <div className="w-full mx-auto bg-[#fff200]  rounded-none px-2 ">
        <div className="flex flex-wrap justify-center text-center">
          {/* Point 1 */}
          <div className="flex flex-col items-center w-1/3
                  max-[575px]:w-full
                  max-[575px]:border
                  max-[575px]:border-[#f5e900]
                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <img src="https://quiz-live.s3.amazonaws.com/upload/cavis-limited/checked-1742549138187.png" alt="" className="w-[20px] lg:max-w-full lg:h-auto" />
            <div className="text-black text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
              Eligibility check, takes just a <span className="font-bold underline">few minutes!</span>
            </div>
          </div>
 
          {/* Point 2 */}
          <div className="flex flex-col items-center w-1/3  
                  max-[575px]:w-full
                  max-[575px]:border
                  max-[575px]:border-[#f5e900]
                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <img src="https://quiz-live.s3.amazonaws.com/upload/cavis-limited/checked-1742549138187.png" alt="" className="w-[20px] lg:max-w-full lg:h-auto" />
            <div className="text-black text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
              <span className="font-bold">Free</span> online check
            </div>
          </div>
 
          {/* Point 3 */}
          <div className="flex flex-col items-center w-1/3
                  max-[575px]:w-full
                  max-[575px]:border
                  max-[575px]:border-[#f5e900]
                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <img src="https://quiz-live.s3.amazonaws.com/upload/cavis-limited/checked-1742549138187.png" alt=""className="w-[20px] lg:max-w-full lg:h-auto" />
            <div className="text-black text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
              <span className="font-bold underline">10,000+</span> signed claimants
            </div>
          </div>
        </div>
 
        <div className="text-center text-black text-[13px] mt-6 opacity-80  font-normal">
          Please note: This claim is handled on a no-win, no-fee basis.
        </div>
      </div>
    </div>
  </section>
);
 
export default InfoBarSection;