import React from "react";
 
const FooterSection = () => (
    <div id="footer-editor-preview" className="w-full mt-[50px] md:mt-[50px]  bg-[#f7f7f7]" >
    <div className="w-full pt-[40px] pb-[40px]  max-[767px]:mt-0">
      <div className="max-w-[700px] mx-auto max-[575px]:px-4 ">
        <div>
          <div className="mb-4">
            <img
              src="https://quiz-live.s3.amazonaws.com/upload/cavis-limited/tdba-logo-3-1743052888228.png"
              alt="Logo"
              className="w-[300px] max-[767px]:w-[200px]"
            />
          </div>
          <p className="text-[13px] leading-[1.4] mb-4">
            databreachadvisors.co.uk is a registered trading name of Cavis Limited. Cavis Limited is
            registered in the United Kingdom under company number 16130455 with its registered office
            located at Cavis Limited, c/o Brabners Llp, 100 Barbirolli Square, Manchester, United
            Kingdom, M2 3BD.
          </p>
          <p className="text-[13px] leading-[1.4] mb-4">
            Cavis Limited is not a law firm. We connect individuals with law firms and provide our
            service at no cost to you. While we may receive a referral fee from the law firms we
            introduce you to, this does not influence how much you get compensated if your claim is
            successful. We do not take responsibility for the legal advice or services offered by
            these firms. The content on this website is for informational purposes only and should not
            be considered legal advice. While we assess claim eligibility, we cannot guarantee that a
            law firm will take on your case.
          </p>
          <p className="text-[13px] leading-[1.4]">
            <a
              href="https://start.databreachadvisors.co.uk/s/8K62nIBaSouH31RyWGxRE3oWS9dxCunSO9CvA6r7"
              target="_blank"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
 
);
 
export default FooterSection;