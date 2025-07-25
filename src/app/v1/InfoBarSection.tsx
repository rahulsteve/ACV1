import React from "react";
import Image from 'next/image';
 
const InfoBarSection = () => (
  <section className="w-full
  bg-[#ff5708]
  border-b-2
  border-[#f5e900]
  mt-[50px]
  pt-[40px]
  pb-[20px]">
    <div className="max-w-[800px] mx-auto px-4">
      <div className="w-full mx-auto bg-[#ff5708]  rounded-none px-2 ">
        <div className="flex flex-wrap justify-center text-center">
          {/* Point 1 */}
          <div className="flex flex-col items-center w-1/3
                  max-[575px]:w-full

                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <Image src="/checked.png" alt="" className="w-[20px] lg:max-w-full lg:h-auto" width={20} height={20} />
            <div className="text-white text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
            <strong>  Quick & Easy</strong>
            </div>
          </div>
 
          {/* Point 2 */}
          <div className="flex flex-col items-center w-1/3  
                  max-[575px]:w-full

                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <Image src="/checked.png" alt="" className="w-[20px] lg:max-w-full lg:h-auto" width={20} height={20} />
            <div className="text-white text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
             <strong>
             Save 84% This Month
              </strong>
            </div>
          </div>
 
          {/* Point 3 */}
          <div className="flex flex-col items-center w-1/3
                  max-[575px]:w-full

                  max-[575px]:mt-[10px]
                  max-[575px]:px-[10px]
                  max-[575px]:pt-[10px]
                  max-[575px]:pb-[20px]">
            <Image src="/checked.png" alt=""className="w-[20px] lg:max-w-full lg:h-auto" width={20} height={20} />
            <div className="text-white text-[16px] max-[575px]:text-[15px] leading-[1.3] text-center font-normal mt-[5px]">
          <strong>Trustpilot Rated &apos;Excellent&apos;</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
 
export default InfoBarSection;