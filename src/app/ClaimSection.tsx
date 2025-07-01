import React from "react";
 
const ClaimSection = () => (
  <section className="w-full bg-[#fff200] pb-[30px]">
    <div className="max-w-[700px] mx-auto max-[1199px]:px-[30px]">
      <h2
        className="text-[35px] max-[575px]:text-[25px] leading-[1.1] pt-[20px] pb-[10px] font-bold font-inter"
      >
        The Claim
      </h2>
      <div className="text-[16px] leading-[1.15] text-black font-normal font-inter" >
      <p className="text-[16px] max-[575px]:text-[15px] mb-4">
          In December 2022, Arnold Clark was subject to a ransomware attack, in which more than 500GB of data was stolen and posted on the dark web. This included sensitive information such as copies of passports and bank information which are believed to be used by criminals to target victims with phishing attacks and other scams.
        </p>
        <p className="text-[16px] max-[575px]:text-[15px] mb-4">
          The Data Breach Advisors has partnered with KP Law Limited who, if you’re eligible, will take your case on, on a no-win, no-fee basis.
        </p>
      </div>
    </div>
  </section>
);
 
 
export default ClaimSection;