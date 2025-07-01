"use client";
import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import MainSection from "./MainSection";
import InfoBarSection from "./InfoBarSection";
import ClaimSection from "./ClaimSection";
import FAQSection from "./FAQSection";
import FooterSection from "./FooterSection";

export default function Home() {
  const [step, setStep] = useState(1);
  const [exited, setExited] = useState(false);

  // If step 1, show all sections. If exited, show only MainSection and FooterSection. Otherwise, show only MainSection and FooterSection.
  const showAll = step === 1 && !exited;

  return (
    <div className="min-h-screen bg-[#fff] flex flex-col">
      <HeaderSection />
      <main>
        <MainSection step={step} setStep={setStep} exited={exited} setExited={setExited} />
        {showAll ? (
          <>
            <InfoBarSection />
            <ClaimSection />
            <FAQSection />
            <FooterSection />
          </>
        ) : (
          <FooterSection />
        )}
      </main>
    </div>
  );
}

