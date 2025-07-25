"use client";
import React, { useEffect, useRef } from "react";
import './globals.css';
import PersonalDetailsForm from './PersonalDetailsForm';
import Image from 'next/image';

const initialDetails = {
  title: '',
  firstName: '',
  lastName: '',
  postcode: '',
  mobileNumber: '',
  emailAddress: '',
};




interface MainSectionProps {
  step: number;
  setStep: (step: number) => void;
  exited: boolean;
  setExited: (exited: boolean) => void;
}

// Helper functions for date formatting
function formatDateDDMMYYYY(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatTimeHHMMSS(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const MainSection = ({ step, setStep, exited, setExited }: MainSectionProps) => {
  const [answers, setAnswers] = React.useState({
    q1: '', q2: '', q2a: '', q3: '', q4: ''
  });
  const [details, setDetails] = React.useState(initialDetails);
  const [errors, setErrors] = React.useState({ firstName: '', lastName: '', mobileNumber: '', emailAddress: '' });
  //const [numberCheckError] = React.useState('');
  const [q1Highlight, setQ1Highlight] = React.useState(false);
  const [lastStep, setLastStep] = React.useState(1);
  const urlParamsRef = useRef<Record<string, string>>({});
  const urlParamsStringRef = useRef<string>("");
  // Add highlight class for q1 buttons
  const highlightClass = q1Highlight ? 'q1-highlight' : '';

  // State to track if address has been retrieved
  const contactHeaderRef = React.useRef<HTMLHeadingElement>(null);
  // Refs for contact info fields

  // Refs for other step headers
  const addressHeaderRef = React.useRef<HTMLHeadingElement>(null);
  const scrollToTopRef = React.useRef<HTMLHeadingElement>(null);
  const documentsHeaderRef = React.useRef<HTMLHeadingElement>(null);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const errorClearTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
 
  useEffect(() => {
    const entries = Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    );

    urlParamsRef.current = entries;                       // ← object
    urlParamsStringRef.current = new URLSearchParams(entries).toString();
  }, []);



  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (errorClearTimeoutRef.current) {
        clearTimeout(errorClearTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handlers for each step
  const handleAnswer = (q: string, value: string) => {
    setLastStep(step)
    let nextStep = step + 1;
    const newAnswers = { ...answers, [q]: value };
    if (q == 'q1') {
    nextStep = 2;
    }
    if (q == 'q2') {
      nextStep = 6
    }

    if (q == 'q4') {
   nextStep =7;    
    }

    // // Logic for navigation
    // if (q === 'q2') {
    //   if (value === 'Yes') {
    //     console.log('q2', value);
    //     nextStep = 5; // Go to Q2A
    //   } else {
    //     nextStep = 4;
    //   }
    // }
    // if (q === 'q2a' && value === 'No') {
    //   setExited(true); return;
    // }
    // if (q === 'q3' && value === 'Yes') {
    //   setExited(true); return;
    // }
    setAnswers(newAnswers);
    console.log('initialDetails', details);
    setStep(nextStep);
  };

  // Personal details validation
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newDetails = { ...details, [e.target.name]: e.target.value };
    setDetails(newDetails);
    // Re-validate on every change
    const newErrors = { ...errors };
    if (e.target.name === 'firstName') {
      newErrors.firstName = newDetails.firstName.trim().length < 2 ? 'First name must be more than 2 characters long!' : '';
    }
    if (e.target.name === 'lastName') {
      newErrors.lastName = newDetails.lastName.trim().length < 2 ? 'Last name must be more than 2 characters long!' : '';
    }
    if (e.target.name === 'emailAddress') {
      newErrors.emailAddress = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDetails.emailAddress.trim())) ? 'Please enter a valid email address.' : '';
    }
    if (e.target.name === 'mobileNumber') {
      newErrors.mobileNumber =  !/^07\d{9}$/.test(newDetails.mobileNumber.trim()) ? 'Mobile number must be 11 digits and start with 07.' : '';
    }
    setErrors(newErrors);
  };

  const validateDetails = () => {
    let valid = true;
    const newErrors = { firstName: '', lastName: '', mobileNumber: '', emailAddress: '' };
    if (details.firstName.trim().length < 2) {
      newErrors.firstName = 'First and last name must be at least 2 characters long!';
      valid = false;
    }
    if (details.lastName.trim().length < 2) {
      newErrors.lastName = 'First and last name must be at least 2 characters long!';
      valid = false;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address.';
      valid = false;
    }
    if (/^07\d{9}$/.test(details.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 11 digits and start with 07.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateDetails()) {
      setStep(11);
      handleSubmit();
    }
  };

  // Step content
  React.useEffect(() => {
    if (step === 2 || step === 4) {
      setTimeout(() => {
        scrollToTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
    if (step === 9) {
      setTimeout(() => {
        contactHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
    if (step === 8) {
      setTimeout(() => {
        addressHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
    if (step === 10) {
      setTimeout(() => {
        documentsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [step]);

  // Scroll to top on step 11
  React.useEffect(() => {
    if (step === 11) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Utility to generate a 9-digit unique number
  function generateLeadId() {
    // Generate a random 9-digit number as a string
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  //FB Event Pixel 
  React.useEffect(() => {
    if (step === 11 && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
  }, [step]);

  // Add this function inside MainSection component, before return
  const handleSubmit = () => {

    // Try to get IP address (optional, fallback to empty string)

    setStep(11);

    const ipPromise = fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => '');

    Promise.all([ipPromise]).then(([ip]) => {
      const now = new Date();
      const payload = {
        campaign: 'ms',
        leadid: `${generateLeadId()}_MS`,
        templateid: 'ms.html',
        title: details.title,
        phone: details.mobileNumber,
        email: details.emailAddress,
        firstname: details.firstName,
        lastname: details.lastName,
        address1:  '',
        address2:  '',
        town: '',
        postcode:details.postcode,
        keptacopy: answers.q2a,
        notificationreceived: answers.q1,
        coopstoremembership: '',
        datetime: `${formatDateDDMMYYYY(now)} ${formatTimeHHMMSS(now)}`,
        ipaddress: ip,
        url: 'ms.databreaches.co.uk',
        consent: '',
        signature: '',
        date: formatDateDDMMYYYY(now),
        time: formatTimeHHMMSS(now),
        filename: "ms",
        cavisConsent: '',
        source: "FB",
        utm: urlParamsStringRef.current
      };

      // fire-and-forget; still survives page unload
      fetch('/api/submit-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => console.error('submit-claim failed:', err));

      fetch('/api/submit-claim-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => console.error('submit-claim failed:', err));
    });
  };


  if (exited) {
    return (
      <section className="not-eligible">
        <div className="mx-auto max-w-[700px] container_inner text-center pt-[16px]">
          <br />
          <br />
          <p>
            <Image height={78} width={78} src="/close.png" alt="" className="mx-auto mb-4" />
          </p>
          <h2 className="text-[35px] font-bold leading-[1.2] tracking-[-0.7px] pt-[10px] mb-4">Sorry! Based on the answers provided
            you do not qualify for this claim.
          </h2>
          <button
            type="button"
            className="mt-[40px] flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
            onClick={() => { setStep(lastStep); setExited(false) }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2"><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="w-full banner_section ">
        <div className="mx-auto pt-[1px] max-w-[700px] max-[480px]:px-[15px]  max-[1199px]:px-[30px] container_inner">
          {step === 1 && (
            <h1 className="h-full pt-[35px] text-[45px] leading-[1.1] tracking-[-0.03em] max-[575px]:tracking-[-0.01em] text-[#0a0a0a] pt-[35px] max-[480px]:pt-[30px] max-[480px]:text-[28px] max-[575px]:text-[35px] font-bold text-left">
              Get a Professional Will Written for just  <span className="bg-[#00b779] text-white pt-[2px] m-[2px]"> £59.00 </span>
              this month - and save £100s on solicitor fees. Exclusive discount available for a limited time.
            </h1>
          )}
          {step === 1 && (
            <p className="mt-[16px] mb-[16px] text-left max-[575px]:text-[15px] tracking-[0]">
              Join 1,000s of Brits getting a Professional Will Written for just £59 this month - saving £100s on expensive solicitor fees. Exclusive discount available for a limited time.
            </p>)}

          {/* Step 1 */}
          {step === 1 && (
            <div className="button_section">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] text-[#0a0a0a] tracking-[-0.03em] max-[575px]:tracking-[-0.03em] ">
              Who is the Will for?
              </h2>

              <div className="flex gap-[16px] button_row">
                <div className={highlightClass + " button_cal w-1/2"}
                  onClick={() => { handleAnswer('q1', 'Me'); setQ1Highlight(false); }}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio1"
                    name="will_for"
                    value="Me"
                    autoComplete="off"

                    required
                  />
                  <label
                    htmlFor="radio1"
                    className='text-center max-[575px]:mt-2 max-[575px]:text-[15px] font-[700]'
                  >Me</label>
                </div>
                <div className={highlightClass + " button_cal w-1/2"}
                  onClick={() => { handleAnswer('q1', 'Me & My Partner'); setQ1Highlight(false); }}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio2"
                    name="will_for"
                    value="Me & My Partner"
                    autoComplete="off"
                    required
                  />
                  <label
                    htmlFor="radio2"
                    className='max-[575px]:mt-2 max-[575px]:text-[15px] font-[700]'
                  >Me & My Partner</label>
                </div>
              </div>

              <div className="button_box w-full">
                <button
                  type="button"
                  className="pa w-full
                             px-[50px] py-[25px] mt-[10px]
                             max-[575px]:py-[20px]
                             text-white max-[575px]:text-[18px] text-[20px] font-[700]
                             border-2 border-[#008f5f]
                             rounded-[5px] cursor-pointer
                             tracking-[-0.02em]
                             bg-[#00b779]
                             max-[575px]:bg-none"
                  onClick={() => {
                    setQ1Highlight(true);
                  }}
                >
                  Get Your Discount
                </button>
                <button className="next-btn hidden" id="next-btn"></button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="button_section min-[575px]:mt-[20px] max-[575px]:pt-[1rem] min-[575px]:pt-[20px]">
              <h2 ref={scrollToTopRef} className="leading-[1.3] text-[24px] font-[600] mt-0 mb-[20px] px-[10px] min-[575px]:tracking-[-0.04em] max-[575px]:tracking-[-0.03em] min-[575px]:transition-transform min-[575px]:origin-left min-[575px]:scale-[1.02]">
                Do you own your home?
              </h2>
              <div className="flex flex-col gap-[15px] button_row m-[.5rem]">
                <div className="button_cal w-full" onClick={() => handleAnswer('q2', 'Yes')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio3"
                    name="have_you_purchased_vehicle"
                    value="Yes"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio3">Yes</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q2', 'No')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio4"
                    name="have_you_purchased_vehicle"
                    value="No"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio4">No</label>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => setStep(1)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2"><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}


          {/* Step 6 (Q4) */}
          {step === 6 && (
            <div className="button_section max-[575px]:py-[1em] px-[10px] min-[575px]:mt-[20px] min-[575px]:pt-[20px]">
              <h2 className="leading-[1.3] tracking-[-0.03em] text-[24px] font-semibold mt-0 mb-[20px] ">
                How many children do you have?
              </h2>

              <div className="flex flex-col gap-[15px] button_row m-[.5rem]">
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', 'None')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio_q4_none"
                    name="q4_number"
                    value="None"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio_q4_none">None</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', '1')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio_q4_1"
                    name="q4_number"
                    value="1"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio_q4_1">1</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', '2')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio_q4_2"
                    name="q4_number"
                    value="2"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio_q4_2">2</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', '3+')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio_q4_3plus"
                    name="q4_number"
                    value="3+"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio_q4_3plus">3+</label>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => {
                  setStep(2)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}

          {/* Step 7: Personal Details */}
          {step === 7 && (
            <div className="max-[575px]:pt-[1rem] min-[575px]:pt-[20px]">
              <PersonalDetailsForm
                details={details}
                errors={errors}
                onDetailsChange={handleDetailsChange}
                onNext={handleNext}
              />
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => {
                  setStep(6);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}

          {/* Step 11: Thank You Page */}
          {step === 11 && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center py-4">
              <div className="bg-[#00b779] rounded-full w-14 h-14 flex items-center justify-center mb-6 mt-8">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2 className="text-[35px] font-bold mb-S">Good news! You&apos;re eligible for a Discounted Will.</h2>
              <p className="mb-4 mt-4 text-[16px]">
                One of our Will Writing experts will be in touch shortly to discuss your individual needs. This initial call is free and there is no-obligation. Please look out for their call.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection; 