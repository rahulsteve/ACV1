import React from "react";

const ClaimSection = () => (
  <section className="w-full bg-[#fff200] pb-[30px]">
    <div className="max-w-[700px] mx-auto max-[1199px]:px-[30px] max-[575px]:px-[15px]">
      <h2
        className="text-[35px] max-[575px]:text-[25px] leading-[1.1] pt-[20px] pb-[10px] font-bold font-inter"
      >
        The Claim
      </h2>
      <div className="text-[16px] leading-[1.15] text-black font-normal font-inter" >
        <p className="text-[16px] max-[575px]:text-[15px] mb-4">
          In April 2025, Marks and Spencer (M&S) were subject to a cyberattack which resulted in a number of customers personal data being compromised. The compromised information may have included phone numbers, addresses and dates of birth.        </p>
        <p className="text-[16px] max-[575px]:text-[15px] mb-4">
          The Data Breach Advisors has partnered with KP Law Limited who, if you’re eligible, will take your case on, on a no-win, no-fee basis. 
        </p>
      </div>
    </div>
  </section> 
);


export default ClaimSection;