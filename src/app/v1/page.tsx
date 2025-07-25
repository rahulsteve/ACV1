"use client";
import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import MainSection from "./MainSection";
import InfoBarSection from "./InfoBarSection";
import ClaimSection from "./ClaimSection";
import FooterSection from "./FooterSection";
import Pixel from "./pixel";
import Script from 'next/script';

export default function Home() {
  const [step, setStep] = useState(1);
  const [exited, setExited] = useState(false);

  // If step 1, show all sections. If exited, show only MainSection and FooterSection. Otherwise, show only MainSection and FooterSection.
  const showAll = step === 1 && !exited;

  return (
    <div className="min-h-screen bg-[#fff] flex flex-col">
       <>
      <Pixel />

      {/* Cookiebot script    */}
        <Script
          id="Cookiebot"
          strategy="afterInteractive"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="2bc10402-6a79-4cb7-913c-6a1c6423857e"
          data-blockingmode="auto"
          type="text/javascript"
        />
{/* crazy egg    */}
       <Script
  src="//script.crazyegg.com/pages/scripts/0129/9936.js"
  strategy="afterInteractive"  
/>

      <HeaderSection />
      <main>
        <MainSection step={step} setStep={setStep} exited={exited} setExited={setExited} />
        {showAll ? (
          <>
            <InfoBarSection />

            <FooterSection />
          </>
        ) : (
          <FooterSection />
        )}
      </main>
       </>
    </div>
  );
}

