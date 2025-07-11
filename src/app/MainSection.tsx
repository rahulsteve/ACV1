"use client";
import React from "react";
import './globals.css';
import PersonalDetailsForm from './PersonalDetailsForm';
import SignatureCanvas from 'react-signature-canvas';

const initialDetails = {
  title: '',
  firstName: '',
  lastName: '',
  day: '',
  month: '',
  year: '',
};



function isOver18(day: string, month: string, year: string) {
  if (!day || !month || !year) return false;
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

interface MainSectionProps {
  step: number;
  setStep: (step: number) => void;
  exited: boolean;
  setExited: (exited: boolean) => void;
}

interface PostcodeSuggestion {
  id: string;
  summaryline: string;
  locationsummary?: string;
  type?: string;
  count?: number;
  addressline1?: string;
  addressline2?: string;
  posttown?: string;
  county?: string;
  postcode?: string;
  label?: string;
  location?: string;
  value?: string;
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
  const [errors, setErrors] = React.useState({ firstName: '', lastName: '', dob: '' });
  const [postcode, setPostcode] = React.useState("");
  const [PostCodeId, setPostCodeId] = React.useState("");
  const [address, setAddress] = React.useState<PostcodeSuggestion | null>(null);
  const [contact, setContact] = React.useState({ mobile: '', email: '' });
  const [agreementAccepted, setAgreementAccepted] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [marketingConsent, setMarketingConsent] = React.useState("");
  const sigPadRef = React.useRef<SignatureCanvas>(null);
  const [agreementError, setAgreementError] = React.useState("");
  const [signatureError, setSignatureError] = React.useState("");
  const [marketingError] = React.useState("");
  const [canvasWidth, setCanvasWidth] = React.useState(400);
  const [canvasHeight, setCanvasHeight] = React.useState(200);
  //const [numberCheckError] = React.useState('');
  const [q1Highlight, setQ1Highlight] = React.useState(false);

  // Add highlight class for q1 buttons
  const highlightClass = q1Highlight ? 'q1-highlight' : '';

  // Ref for Next button in address step
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  // State to track if address has been retrieved
  const contactHeaderRef = React.useRef<HTMLHeadingElement>(null);
  // Refs for contact info fields
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  // Refs for other step headers
  const addressHeaderRef = React.useRef<HTMLHeadingElement>(null);
  const scrollToTopRef = React.useRef<HTMLHeadingElement>(null);
  const documentsHeaderRef = React.useRef<HTMLHeadingElement>(null);

  const [numberCheckError, setNumberCheckError] = React.useState<string>('');
  const [numberSuccess, setNumberSuccess] = React.useState<string>('');
  const [mobileValidating, setMobileValidating] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<string>('');
  const [emailSuccess, setEmailSuccess] = React.useState<string>('');

  // Postcode autocomplete states
  const [postcodeSuggestions, setPostcodeSuggestions] = React.useState<PostcodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [isLoadingPostcodes, setIsLoadingPostcodes] = React.useState(false);
  const [postcodeError, setPostcodeError] = React.useState<string>('');
  const [rateLimitRetry, setRateLimitRetry] = React.useState<number>(0);
  const [errorCountdown, setErrorCountdown] = React.useState<number>(0);

  // Cache for postcode suggestions to avoid repeated API calls
  const postcodeCache = React.useRef<Map<string, PostcodeSuggestion[]>>(new Map());
  const lastSearchQuery = React.useRef<string>('');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const errorClearTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const validatePhoneNumber = async (phone: string) => {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lookup: phone }),   // << lookup param expected by your route
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to validate');
    /** Adjust this condition to match DataSoap's actual response shape */
    if (!data.valid) throw new Error('Number is not a valid UK mobile');
    return data;
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to set error with auto-clear and countdown
  const setPostcodeErrorWithTimeout = (error: string, timeoutMs: number = 30000) => {
    setPostcodeError(error);
    setErrorCountdown(Math.ceil(timeoutMs / 1000));
    console.log(postcodeError)
    // Clear previous timeout and interval
    if (errorClearTimeoutRef.current) {
      clearTimeout(errorClearTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setErrorCountdown(prev => {
        if (prev <= 1) {
          // Clear interval when countdown reaches 0
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set new timeout to clear error
    errorClearTimeoutRef.current = setTimeout(() => {
      setPostcodeError('');
      setErrorCountdown(0);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }, timeoutMs);
  };

  // Optimized postcode autocomplete function with debouncing and caching
  const searchPostcodes = async (query: string, PathFilter: string = "") => {
    if (query.length < 3) {
      setPostcodeSuggestions([]);
      setShowSuggestions(false);
      setPostcodeError('');
      console.log(showSuggestions)
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Create cache key
    const cacheKey = `${query.trim()}_${PathFilter}`;

    // Check cache first
    if (postcodeCache.current.has(cacheKey)) {
      const cachedResults = postcodeCache.current.get(cacheKey);
      setPostcodeSuggestions(cachedResults || []);
      setShowSuggestions((cachedResults || []).length > 0);
      setPostcodeError('');
      return;
    }

    // Debounce the API call
    searchTimeoutRef.current = setTimeout(async () => {
      // Don't search if query has changed
      if (query.trim() !== lastSearchQuery.current) {
        return;
      }

      setIsLoadingPostcodes(true);
      setPostcodeError('');

      try {
        const response = await fetch(`/api/postcode-autocomplete?q=${encodeURIComponent(query)}&PF=${encodeURIComponent(PathFilter)}`);

        if (response.status === 429) {
          // Rate limit hit - implement exponential backoff
          const retryDelay = Math.min(1000 * Math.pow(2, rateLimitRetry), 10000);
          setPostcodeErrorWithTimeout(`Too many requests. Please wait ${Math.ceil(retryDelay / 1000)} seconds and try again.`, 30000);
          setRateLimitRetry(prev => prev + 1);

          // Auto-retry after delay
          setTimeout(() => {
            if (query.trim() === lastSearchQuery.current) {
              searchPostcodes(query, PathFilter);
            }
          }, retryDelay);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the results
        postcodeCache.current.set(cacheKey, data);

        setPostcodeSuggestions(data);
        setShowSuggestions(data.length > 0);
        setRateLimitRetry(0); // Reset retry counter on success

      } catch (error) {
        console.error('Error fetching postcode suggestions:', error);
        setPostcodeErrorWithTimeout(error instanceof Error ? error.message : 'Failed to fetch postcode suggestions', 30000);
        setPostcodeSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingPostcodes(false);
      }
    }, 500); // 500ms debounce delay

    lastSearchQuery.current = query.trim();
  };

  // Retrieve address function with better error handling
  const retrieveAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/postcode-retrieve?id=${encodeURIComponent(id)}&query=${encodeURIComponent(postcode)}`);

      // if (response.status === 429) {
      //   setPostcodeErrorWithTimeout('Too many requests. Please wait a moment and try again.', 30000);
      //   return;
      // }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAddress(data[0]);
        setPostcodeError('');
        setTimeout(() => {
          nextButtonRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      console.error('Error retrieving address:', error);
      setPostcodeErrorWithTimeout(error instanceof Error ? error.message : 'Failed to retrieve address', 30000);
    }
  };

  // Handle postcode selection
  const handlePostcodeSelect = (address: PostcodeSuggestion) => {
    debugger
    if ((address?.count ?? 0) > 1) {
      searchPostcodes(postcode, address.id);
    } else {
      setPostCodeId(address.id);
      //retrieveAddress(address.id);
      console.log(PostCodeId === "")
    }
  };
  const isPostCodeIdValid = () => {
    return PostCodeId !== ""
  };
  // Handle responsive canvas sizing
  React.useEffect(() => {
    const updateCanvasSize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          // Mobile: full width minus padding, but ensure minimum width
          const mobileWidth = Math.max(window.innerWidth - 40, 300);
          setCanvasWidth(mobileWidth);
          setCanvasHeight(200);
        } else {
          // Desktop: fixed width
          setCanvasWidth(400);
          setCanvasHeight(200);
        }
      }
    };

    // Set initial size
    updateCanvasSize();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateCanvasSize, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
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
    debugger;
    let nextStep = step + 1;
    const newAnswers = { ...answers, [q]: value };
    if (q == '1') {
      if (value === 'Yes') {
        console.log('q2', value);
        nextStep = 5; // Go to Q2A
      } else {
        setExited(true); return;
      }
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
    console.log('nextStep', nextStep);
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
    if (['day', 'month', 'year'].includes(e.target.name)) {
      newErrors.dob = !isOver18(newDetails.day, newDetails.month, newDetails.year) ? 'You must be over 18 years old.' : '';
    }
    setErrors(newErrors);
  };

  const validateDetails = () => {
    let valid = true;
    const newErrors = { firstName: '', lastName: '', dob: '' };
    if (details.firstName.trim().length < 2) {
      newErrors.firstName = 'First and last name must be at least 2 characters long!';
      valid = false;
    }
    if (details.lastName.trim().length < 2) {
      newErrors.lastName = 'First and last name must be at least 2 characters long!';
      valid = false;
    }
    if (!isOver18(details.day, details.month, details.year)) {
      newErrors.dob = 'You must be over 18 years old.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateDetails()) {
      setStep(8);
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

  // Add this function inside MainSection component, before return
  const handleSubmit = async () => {
    const leadId = generateLeadId();
    const now = new Date();
    // Use new formatting helpers
    const timestamp_date = formatDateDDMMYYYY(now); // dd/mm/yyyy
    const timestamp_time = formatTimeHHMMSS(now);   // hh:mm:ss
    const timestamp = `${timestamp_date} ${timestamp_time}`; // dd/mm/yyyy hh:mm:ss
    // Try to get IP address (optional, fallback to empty string)
    let ip_address = '';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      ip_address = ipData.ip || '';
    } catch { }

    const payload = {
      campaign: 'arnoldclark',
      leadid: `${leadId}_Arnold`,
      templateid: 'arnorldclarke1.html',
      title: details.title,
      phone: contact.mobile,
      email: contact.email,
      firstname: details.firstName,
      lastname: details.lastName,
      dob: `${details.day}/${details.month}/${details.year}`,
      address1: address?.addressline1 || '',
      address2: address?.addressline2 || '',
      town: address?.posttown || '',
      postcode: postcode,
      keptacopy: answers.q2a,
      usedinscotland: answers.q2,
      liveinscotland: answers.q3,
      usedarnoldclark: answers.q2,
      notificationreceived: answers.q1,
      datetime: timestamp,      // dd/mm/yyyy hh:mm:ss
      ipaddress: ip_address,
      url: 'www.google.com',
      consent: agreementAccepted,
      signature: signature, // already data:image/png;base64
      date: timestamp_date,     // dd/mm/yyyy
      time: timestamp_time      // hh:mm:ss
    };

    try {
      await fetch("/api/submit-claim"!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setStep(11);
    } catch (err) {
      console.log(err)
    }
  };

  if (exited) {
    return (
      <section className="not-eligible">
        <div className="mx-auto max-w-[700px] container_inner text-center pt-[16px]">
          <br />
          <br />
          <p>
            <img height={78} width={78} src="https://static.leadshook.io/upload/cavis-limited/close%20(2)-1742908286780.png" alt="" className="mx-auto mb-4" />
          </p>
          <h2 className="text-[35px] font-bold leading-[1.2] tracking-[-0.7px] pt-[10px] mb-4">Sorry! Based on the answers provided
            you do not qualify for this claim.
          </h2>
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
              Join The <span className="bg-[#fff41f] pt-[2px] m-[2px]">M&S </span>
              Data Breach Claim
            </h1>
          )}
          {step === 1 && (
            <p className="mt-[16px] mb-[16px] text-left max-[575px]:text-[15px] tracking-[0]">
              Millions of Marks and Spencer customers could be a victim of a serious data breach, which happened in April 2025. Use our free online tool to check if you could be eligible to claim compensation.            </p>)}

          {/* Step 1 */}
          {step === 1 && (
            <div className="button_section">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] text-[#0a0a0a] tracking-[-0.03em] max-[575px]:tracking-[-0.03em] ">
                Did you receive a notification from M&S that your data had been impacted by this data breach?
              </h2>

              <div className="flex gap-[16px] button_row">
                <div className={highlightClass + " button_cal w-1/2"}
                  onClick={() => { handleAnswer('q1', 'Yes'); setQ1Highlight(false); }}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio1"
                    name="have_you_been_notified"
                    value="Yes"
                    autoComplete="off"

                    required
                  />
                  <label
                    htmlFor="radio1"
                    className=' font-[700]'
                  >Yes</label>
                </div>
                <div className={highlightClass + " button_cal w-1/2"}
                  onClick={() => { handleAnswer('q1', 'No'); setQ1Highlight(false); }}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio2"
                    name="have_you_been_notified"
                    value="No"
                    autoComplete="off"
                    required
                  />
                  <label
                    htmlFor="radio2"
                    className=' font-[700]'
                  >No</label>
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
                  Check Your Eligibility
                </button>
                <button className="next-btn hidden" id="next-btn"></button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="button_section min-[575px]:mt-[20px] max-[575px]:pt-[1rem] min-[575px]:pt-[20px]">
              <h2 ref={scrollToTopRef} className="leading-[1.3] text-[24px] font-[600] mt-0 mb-[20px] px-[10px] min-[575px]:tracking-[-0.04em] max-[575px]:tracking-[-0.03em] min-[575px]:transition-transform min-[575px]:origin-left min-[575px]:scale-[1.02]">
                Have you purchased, sold, rented, hired, or leased a vehicle, or had any servicing or repairs carried out by Arnold Clark, or been an employee of Arnold Clark between 2012 and 2022?              </h2>
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

          {/* Step 4 (Q2A) */}
          {step === 4 && (
            <div className="button_section mt-6">
              <h2 ref={scrollToTopRef} className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] ">
                Have you kept a copy of the email or notification?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full" onClick={() => handleAnswer('q2a', 'Yes')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio5"
                    name="kept_copy_notification"
                    value="Yes"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio5">Yes</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q2a', 'Yes')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio6"
                    name="kept_copy_notification"
                    value="No"
                    autoComplete="off"
                    onClick={() => handleAnswer('q2a', 'No')}
                    required
                  />
                  <label htmlFor="radio6">No</label>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => setStep(2)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}

          {/* Step 5 (Q3) */}
          {step === 5 && (
            <div className="button_section max-[575px]:py-[1em] px-[10px] min-[575px]:mt-[20px] min-[575px]:pt-[20px]">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] ">
                Did you live in Scotland when the purchase was made or when you were employed by Arnold Clark?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full" onClick={() => handleAnswer('q3', 'Yes')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio7"
                    name="lived_in_scotland"
                    value="Yes"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio7">Yes</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q3', 'No')} >
                  <input
                    className="hidden"
                    type="radio"
                    id="radio8"
                    name="lived_in_scotland"
                    value="No"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio8">No</label>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => setStep(4)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}

          {/* Step 6 (Q4) */}
          {step === 6 && (
            <div className="button_section max-[575px]:py-[1em] px-[10px] min-[575px]:mt-[20px] min-[575px]:pt-[20px]">
              <h2 className="leading-[1.3] tracking-[-0.03em] text-[24px] font-semibold mt-0 mb-[20px] ">
                Have you suffered distress and/or anxiety upon learning that your sensitive and confidential information may have been stolen?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', 'Yes')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio9"
                    name="suffered_distress"
                    value="Yes"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio9">Yes</label>
                </div>
                <div className="button_cal w-full" onClick={() => handleAnswer('q4', 'No')}>
                  <input
                    className="hidden"
                    type="radio"
                    id="radio10"
                    name="suffered_distress"
                    value="No"
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="radio10">No</label>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => setStep(5)}
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
                onClick={() => setStep(6)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}
          {/* Step 8: Address */}
          {step === 8 && (
            <div className="min-[575px]:mt-8 max-[575px]:pt-[1rem] ">
              <h1 ref={addressHeaderRef} className="max-[575px]:text-[28px] text-[45px] leading-[0.9] tracking-[-0.01em] text-[#0a0a0a] pt-[35px] font-[700] text-left mb-4">Your current address</h1>
              <p className="mb-4 text-[16px] leading-[1.5rem] max-[575px]:text-[15px]">Enter your postcode below and tap &apos;Next&apos;</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Postcode"
                  value={postcode}
                  onChange={e => {
                    const newValue = e.target.value;
                    setPostcode(newValue);
                    setAddress(null);
                    setShowSuggestions(false);
                    setPostcodeError('');
                    setErrorCountdown(0);
                    // Clear any existing error timeout and interval
                    if (errorClearTimeoutRef.current) {
                      clearTimeout(errorClearTimeoutRef.current);
                    }
                    if (countdownIntervalRef.current) {
                      clearInterval(countdownIntervalRef.current);
                    }

                    // Clear suggestions when input changes
                    setPostcodeSuggestions([]);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (postcode.length >= 3) {
                        searchPostcodes(postcode);
                      }
                    }
                  }}
                  className="w-full border rounded px-3 py-4 text-[17px] max-[575px]:text-[14px] pr-20"
                  autoComplete="off"
                />
                {/* Desktop search button */}

                <button
                  type="button"
                  className="absolute right-0
                     top-1/2
                     transform -translate-y-1/2 bg-[#000] font-bold min-[575px]:text-[20px] text-[16px] h-full rounded max-[575px]:text-[15px] text-white max-[575px]:px-5 min-[575px]:px-10 py-4  flex items-center justify-center"
                  onClick={() => {
                    if (postcode.length >= 3 && errorCountdown === 0) {
                      searchPostcodes(postcode);
                    }
                  }}
                  disabled={postcode.length < 3 || isLoadingPostcodes || errorCountdown > 0}
                  tabIndex={0}
                  aria-label="Search Postcode"
                >
                  Search
                </button>

                {isLoadingPostcodes && (
                  <div className="absolute left-0 right-0 bg-white border border-t-0 rounded-b shadow z-10 px-4 py-2 text-gray-500 text-sm">Loading...</div>
                )}
              </div>
              {/* Show select dropdown if suggestions exist */}
              {postcodeSuggestions.length > 0 && (
                <select
                  className={`w-full border rounded px-3 py-3 mt-2 text-[17px] bg-white shadow z-10 ${errorCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={address?.summaryline}
                  onChange={e => {
                    if (errorCountdown > 0) return; // Disable during error countdown
                    const idx = e.target.value;
                    if (idx !== "") {
                      setTimeout(() => {
                        handlePostcodeSelect(postcodeSuggestions[Number(idx)]);
                      });
                    }
                  }}
                  disabled={errorCountdown > 0}
                >
                  <option className={'disabled'} value="">{address?.summaryline ?? "Select your address..."}</option>
                  {postcodeSuggestions.map((suggestion, idx) => (
                    <option key={suggestion.id || idx} value={idx}>
                      {suggestion.summaryline || suggestion.postcode} {suggestion.locationsummary ? `(${suggestion.locationsummary})` : ''}
                    </option>
                  ))}
                </select>
              )}

              <button
                ref={nextButtonRef}
                type="button"
                className={`next-btn pa max-[575px]:w-full w-1/3 px-[50px] py-[25px] mt-[20px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779] max-[575px]:bg-none transition-opacity ${PostCodeId ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={PostCodeId ? () => {
                  retrieveAddress(PostCodeId);
                  setStep(9);
                } : undefined}
                disabled={!isPostCodeIdValid()}
              >
                Next
              </button>
              <button
                type="button"
                className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                onClick={() => setStep(7)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
            </div>
          )}
          {step === 9 && (
            <div className=" min-[575px]:pt-[20px]">
              <div className="min-[575px]:mt-[20px] min-[575px]:pt-[20px]  contact-info">
                <h1 ref={contactHeaderRef} className="min-[575px]:text-[45px] text-[28px] leading-[0.9] tracking-[-0.01em] text-[#0a0a0a] pt-[35px] font-[700] text-left mb-2">Your contact information</h1>

                {/* --‑‑ Mobile -------------------------------------------------- */}
                <h3 ref={mobileRef} className="text-[23px] mb-[10px] mt-[20px] max-[575px]: mt-[20px]">
                  <strong>Mobile number</strong>
                </h3>
                <p className="mb-4 text-[16px] leading-[1.5rem] max-[575px]:text-[15px]">Enter your current mobile number</p>

                <div className={`flex items-center w-full border rounded mobile-div px-3 py-4 text-[20px] mb-2 bg-white
                     ${numberCheckError ? 'border-red-500' : ''}`}>
                  <span className="mr-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                      alt="UK"
                      style={{ width: 28, height: 20 }}
                    />
                  </span>

                  <input

                    type="tel"
                    placeholder="Mobile number"
                    value={contact.mobile}
                    onChange={(e) => {
                      setContact({ ...contact, mobile: e.target.value });
                      setNumberCheckError('');
                      setNumberSuccess('');
                    }}
                    onFocus={() => {
                      mobileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const phone = contact.mobile.trim();
                        if (!phone) return;
                        try {
                          setMobileValidating(true);
                          await validatePhoneNumber(phone);
                          setNumberSuccess('Valid Number');
                          setTimeout(() => {
                            emailRef.current?.focus();
                          }, 0);
                        } catch (err) {
                          setNumberCheckError(err instanceof Error ? err.message : 'An unknown error occurred');
                          setTimeout(() => {
                            mobileRef.current?.focus();
                          }, 0);
                        } finally {
                          setMobileValidating(false);
                        }
                      }
                    }}
                    onBlur={async (e) => {
                      const phone = e.target.value.trim();
                      if (!phone) return;
                      try {
                        setMobileValidating(true);
                        await validatePhoneNumber(phone);
                        setNumberSuccess('Valid Number');
                        // Move focus to email if valid
                        setTimeout(() => {
                          emailRef.current?.focus();
                        }, 0);
                      } catch (err: unknown) {
                        if (err instanceof Error) {
                          setNumberCheckError(err.message);
                        } else {
                          setNumberCheckError('An unknown error occurred');
                        }
                      } finally {
                        setMobileValidating(false);
                      }
                    }}
                    className="flex-1 outline-none border-none bg-transparent text-[17px] max-[575px]:text-[14px] mobile-input-bg"
                    style={{ minWidth: 0 }}
                    autoComplete="tel"
                  />
                </div>

                {mobileValidating && (
                  <div className="text-gray-500 text-sm mb-2">Validating…</div>
                )}
                {numberCheckError && (
                  <div className="text-red-600 text-sm mb-2">{numberCheckError}</div>
                )}
                {numberSuccess && (
                  <div className="text-green-600 text-sm mb-2">{numberSuccess}</div>
                )}

                {/* --‑‑ Email --------------------------------------------------- */}
                <h3 className="text-[23px] font-[700] mb-2 mt-6">Email address</h3>
                <p className="mb-4 text-[16px] leading-[1.5rem] max-[575px]:text-[15px]">Enter your current email address</p>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email address"
                  value={contact.email}
                  onChange={(e) => {
                    setContact({ ...contact, email: e.target.value });
                    setEmailError('');
                    setEmailSuccess('');
                    if (validateEmail(e.target.value)) {
                      setEmailSuccess('Valid email address');
                    }
                  }}
                  onFocus={() => {
                    emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  onBlur={(e) => {
                    const email = e.target.value.trim();
                    if (!email) return;
                    if (validateEmail(email)) {
                      setEmailSuccess('Valid email address');
                      setEmailError('');
                    } else {
                      setEmailError('Please enter a valid email address');
                      setEmailSuccess('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const email = contact.email.trim();
                      if (!validateEmail(email)) {
                        setEmailError('Please enter a valid email address');
                        setEmailSuccess('');
                        setTimeout(() => {
                          emailRef.current?.focus();
                        }, 0);
                      } else if (contact.mobile.trim() && email) {
                        setEmailSuccess('Valid email address');
                        setEmailError('');
                        setTimeout(() => {
                          const nextBtn = document.querySelector('.next-btn') as HTMLElement | null;
                          nextBtn?.click();
                        }, 0);
                      }
                    }
                  }}
                  className={`w-full border email-div rounded px-3 py-4 text-[17px] max-[575px]:text-[14px] mb-2 ${emailError ? 'border-red-500' : emailSuccess ? 'border-green-500' : ''}`}
                  autoComplete="email"
                />
                {emailError && (
                  <div className="text-red-600 text-sm mb-2">{emailError}</div>
                )}
                {emailSuccess && (
                  <div className="text-green-600 text-sm mb-2">{emailSuccess}</div>
                )}

                <button
                  type="button"
                  className={`next-btn pa max-[575px]:w-full ms-auto w-1/3 px-[50px] py-[25px] mt-[20px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779] max-[575px]:bg-none transition-opacity ${(contact.mobile.trim() && contact.email.trim() && validateEmail(contact.email.trim())) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={(contact.mobile.trim() && contact.email.trim() && validateEmail(contact.email.trim())) ? () => setStep(10) : undefined}
                  disabled={!(contact.mobile.trim() && contact.email.trim() && validateEmail(contact.email.trim()))}
                >
                  Next
                </button>
                <div className="mt-4 text-right text-[16px]">
                  <span className="inline-block align-middle mr-1" style={{ verticalAlign: 'middle' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="10" stroke="#00b779" strokeWidth="2" fill="#00b779" />
                      <path d="M7 11.5L10 15.5L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <strong>Join 10,000+ signed claimants.</strong>
                </div>
                <button
                  type="button"
                  className="mt-4 flex items-center text-[#00b779] font-bold text-[18px] hover:underline cursor-pointer"
                  onClick={() => setStep(8)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2"><path d="M12 15L7 10L12 5" stroke="#00b779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
              </div>
            </div>
          )}
          {/* Step 10: Your Documents */}
          {step === 10 && (
            <div className="max-[575px]:mt-[20px] max-w-3xl mx-auto">
              <h1 ref={documentsHeaderRef} className="max-[575px]:text-[21px] text-[35px] leading-[0.9] tracking-[-0.01em] text-[#0a0a0a] min-[575px]:pt-[35px] font-bold text-left mb-4">Your Documents</h1>
              <p className="mb-4 max-[575px]:text-[15px] text-[16px] ">Thank you for your enquiry. Based on the answers provided, you are able to join the KP Law Limited Arnold Clark claim.</p>
              <p className="mb-4 max-[575px]:text-[15px] text-[16px] tracking-[0]" >
                <b>
                  Your potential claim will now be handled by KP Law Limited, who will act as your solicitors throughout this process. KP Law are specialists in data breach claims and will work on your behalf to secure the compensation you may be entitled to. Their experienced legal team will guide your case from start to finish, ensuring that your rights are protected and your claim is pursued efficiently.
                </b>
              </p>
              <p className="mb-4">
                In order for them to process your claim please read the below agreement carefully and sign below.<br />
                <br />
                THIS FORM CONTAINS CONDITIONAL FEE AGREEMENT AND FORM OF AUTHORITY<br />
                PLEASE READ THESE CAREFULLY AND ENSURE THAT YOU UNDERSTAND THEM.
              </p>
              <a href="#" className="text-blue-600 mb-6 inline-block">Guidance notes for this document are highlighted and in blue</a>

              <h4 className="leading-[1.3] font-bold min-[575px]:text-[18px] text-[1rem] text-[#00b779] border-b-4 border-[#00b779] inline-block my-[30px]">CONDITIONAL FEE AGREEMENT</h4>

              <div className="scrollableBox mb-8 mt-4">
                <h4 className="min-[575px]:text-[22px] text-[1.125rem] font-semibold mt-[20px] text-gray-700">The Agreement</h4>
                <p className="my-[14px]">This agreement is governed by the law of England and Wales.</p>
                <p className="mb-2">This agreement is a legal contract between you <b>({details.firstName} {details.lastName})</b> and your Solicitor(s). Before agreeing to the terms of this contract, you must read the whole contract carefully.</p>
                <p className="mb-2">The Agreement must be read in conjunction with your Solicitor&apos;s Client Care Letter, their Terms and Conditions, and the Notice of Right to Cancel. If you agree to be bound by the terms of this Agreement, you should sign where indicated at the end of this document. By signing, you also acknowledge receipt of the Notice of Right to Cancel and the Cancellation Notice.</p>
                <p className="mb-2">The agreement is designed to avoid future disputes and, as such, the parties have agreed in advance on what will happen if the claim does not conclude in a &apos;Win&apos;.</p>
                <h3 className="font-[600] text-[1.5rem] mt-4 mb-2">THE SCOPE OF THIS AGREEMENT IS AS FOLLOWS</h3>
                <div className="mb-2">
                  <h3 className="font-[600] text-[1.5rem]">1. What is covered by this Agreement?</h3>
                  <ul className="list-none">
                    <li><b>1.1</b> Your claim for damages for Distress and Loss (including General Damages for Pain, Suffering, and Loss of Amenity, and Damages for Pecuniary Loss) suffered due to, but not exclusively, the misuse of private information by the defendant.</li>
                    <li><b>1.2</b> All work already undertaken on your behalf, including the work required in setting up this agreement.</li>
                    <li><b>1.3</b> Any application for pre-action or non-party disclosure.</li>
                    <li><b>1.4</b> Any appeal you make against an interim order or an assessment of costs.</li>
                    <li><b>1.5</b> ADR (including mediation) relating to the claim.</li>
                    <li><b>1.6</b> Any appeal by the opponent.</li>
                    <li><b>1.7</b> Any proceedings you take to enforce a court judgment, order, or agreement.</li>
                    <li><b>1.8</b> Negotiations about and/or a court assessment of the costs of this claim.</li>
                  </ul>
                </div>
                <div className="mb-2">
                  <h3>2. What is not covered by this Agreement (unless otherwise agreed)?</h3>
                  <ul className="list-none">
                    <li><b>2.1</b> Any appeal you make against the final judgment or order.</li>
                    <li><b>2.2</b> Any Part 20 Counterclaim made against you, or a Counterclaim or Defence by way of set-off which still exists after your claim has either been &apos;Won&apos;, &apos;Lost&apos;, or otherwise concluded.</li>
                    <li><b>2.3</b> Any appeal against an interim order made by your opponent.</li>
                  </ul>
                </div>
                <div className="mb-2">
                  <h3>3. Paying Us If You &apos;Win&apos;</h3>
                  <ul className="list-none">
                    <li><b>3.1</b> If your claim is successful, you are liable to pay all our basic charges, our expenses and disbursements, and a success fee, along with the premium for any After The Event (ATE) insurance you take out.</li>
                    <li><b>3.2</b> If your claim is valued above the Small Claims Limit (£1,500 for damages for Pain, Suffering, and Loss of Amenity or £10,000 for other losses), you may be entitled to seek recovery of part or all of our basic charges and expenses from the opponent. The ATE Insurance premium may also be recoverable from the opponent, with any unrecovered amount being paid by you. you subject to clause 8.5 below.</li>
                  </ul>
                  <p><em>Guidance Note: Section 3</em></p>
                  <p><em>We understand that this wording can be confusing and that you might be worried about how much you will have to pay if you win.</em></p>
                  <p><em>Legally, we must word our CFA in a specific way, but if your claim is successful, the only thing you will pay is our success fee. We will recover all the other costs, charges and expenses (including insurance premiums) that you are liable for from the Defendant or the insurance provider.</em></p>
                  <p><em>Any success fee deducted from your compensation will be capped at 25% and we guarantee that you will receive no less than 75% of any compensation awarded to you as long as you abide by our T&Cs.*</em></p>
                </div>
                <div className="mb-2">
                  <h3>4. Disbursements and Expenses</h3>
                  <ul className="list-none">
                    <li><b>4.1</b> If you receive interim damages before the end of your claim, we may require you to pay our disbursements and expenses to date at that point and an amount for future expenses and disbursements;</li>
                    <li><b>4.2</b> If your claim is successful but you are ordered to pay the other side&apos;s charges following an Interlocutory Hearing, then such charges will usually only be up to the amount of damages awarded to you. Such charges may be covered by your ATE insurance policy subject to the terms of the policy and your compliance with such terms;</li>
                    <li><b>4.3</b> If, prior to a final Judgment, you are awarded any costs, either by way of a Court Order or Agreement, then we are entitled to payment of those costs together with any success fee on those charges if your claim is successful.</li>
                  </ul>
                </div>
                <div className="mb-2">
                  <h3>5. What Do I Pay If I Lose?</h3>
                  <ul className="list-none">
                    <li><b>5.1</b> If you lose you do not have to pay our basic charges provided that you have complied with our Terms and Conditions. However, you may be required to pay our disbursements and expenses, although these may be covered by any ATE insurance policy you have purchased, subject to compliance with the Terms and Conditions of that policy;</li>
                    <li><b>5.2</b> If you lose your claim, you may be responsible for some, or all, of the Opponent&apos;s costs. If your claim includes a claim for General Damages for Pain, Suffering and Loss of Amenity, then you may benefit from Qualified One-Way Costs Shifting. In such circumstances, the Court will not usually enforce an Order for Costs against you unless:
                      <ul className="list-none">
                        <li><b>5.2.1</b> The claim is fundamentally dishonest; or</li>
                        <li><b>5.2.2</b> The proceedings have been struck out; or</li>
                        <li><b>5.2.3</b> The claim includes a claim for the financial benefit of another party.</li>
                      </ul>
                    </li>
                  </ul>
                  <p><em>Guidance Note: Section 5</em></p>
                  <p><em>We know this can be confusing as you are signing up to no-win, no-fee.</em></p>
                  <p><em>However, we take out insurance to protect you from these costs, and, as long as you agree to this insurance and abide by our T&Cs* you won&apos;t have to pay a penny.</em></p>
                </div>
                <div className="mb-2">
                  <h3>6. Basic Charges</h3>
                  <ul className="list-none">
                    <li><b>6.1</b> These are for work undertaken on your claim from your initial instructions until this Agreement ends. These charges are subject to an annual review;</li>
                    <li><b>6.2</b> We calculate these charges based on each hour engaged on your case. Routine letters and telephone calls are charged as units of 1/10 of an hour. Any other type of letters and telephone calls will be charged on a time engaged basis. The hourly rate that we will charge is £400 per hour depending on the actual work being undertaken and the grade of fee earner undertaking the work. This section should be read alongside our Terms and Conditions and the section entitled &apos;Your Legal Costs and Disbursement&apos;s.</li>
                    <li><b>6.3</b> The hourly rate set out in 6.2 assumes that the work being undertaken relates to negotiations and/or proceedings in the County Court that is commensurate with the type of work, in terms of value and complexity akin to that jurisdiction. Occasionally it may be necessary to commence proceedings in the High Court in relation to declaration proceedings or proceedings for Injunctive relief. In these circumstances, and to reflect the increase complexity of these types of proceedings our hourly rate will be charged at £550 per hour.</li>
                  </ul>
                </div>
                <div className="mb-2">
                  <h3>Right to Cancel/Ending This Agreement</h3>
                  <ul className="list-none">
                    <li><b>7.1</b> If you have entered into this Agreement in the physical presence of our employees, servant and/or agent, away from our business premises (i.e. in your home), or the Contract was agreed on our business premises immediately after you were personally and individually addressed away from our business premises, in the presence of one of our employees, servants and/or agents, then you have a right to cancel this Agreement within 14 days;</li>
                    <li><b>7.2</b> If you cancel within the 14-day time limit, you will pay nothing. However, if you end the Agreement before you &apos;Win&apos; or &apos;Lose&apos;, you pay our basic charges and disbursements and expenses. If your case ultimately succeeds, you also pay a success fee. We reserve the right to end this Agreement at any time if either you have failed to comply with the terms of this Agreement, you reject our advice on any potential settlement or the prospects of success of a &apos;Win&apos; are reduced to below 50%.</li>
                  </ul>
                  <p><em>Guidance Note: Section 7</em></p>
                  <p><em>From the day you sign, you have the right to cancel this agreement within 14 days. If you cancel within the 14-day time limit, you will pay nothing.</em></p>
                  <p><em>However, if you cancel the agreement after this period, you may have to pay our basic charges, disbursements, and expenses. Furthermore, if you eventually win your case, we may also be entitled to a success fee.</em></p>
                  <p><em>If we decide to end our agreement because there is a limited chance of success, you won&apos;t have to pay us anything provided you have adhered to our T&Cs.*</em></p>
                </div>
                <div className="mb-2">
                  <h3>8. The Success Fee</h3>
                  <ul className="list-none">
                    <li><b>8.1</b> The success fee is set at 75% of our basic charges, or 100%, if the claim concludes less than 45 days before Trial, including following a Judgment.</li>
                    <li><b>8.2</b> The success fee percentage reflects the following: -
                      <ul className="list-none">
                        <li><b>8.2.1</b> Our assessment of the risks of your case;</li>
                        <li><b>8.2.2</b> The fact that if you lose, we will not earn anything;</li>
                        <li><b>8.2.3</b> Any other appropriate factors;</li>
                        <li><b>8.2.4</b> Our arrangements with you about paying expenses and disbursements;</li>
                        <li><b>8.2.5</b> The risks of recovering damages from your opponent, which is less than their Part 36 Offer which you have rejected, on our advice;</li>
                        <li><b>8.2.6</b> Unless it is expressly stated in writing, no part of the success fee relates to postponement of payment of fees and expenses.</li>
                        <li><b>8.2.7</b> Additional case specific risks which are set out in any risk assessment.</li>
                      </ul>
                    </li>
                    <li><b>8.3</b> The success fee cannot be more than 100% of the basic charges in total.</li>
                    <li><b>8.4</b> As your claim may include a claim for Pain, Suffering and Loss of Amenity, for psychological or psychiatric injury, there is a maximum limit, in percentage terms, on the level of success fee which we can recover from you.</li>
                    <li><b>8.5</b> That maximum limit is 25% of the total amount of any claim for General Damages for Pain, Suffering, Loss of Amenity and Damages for Pecuniary loss. Claims for future Pecuniary Loss are unaffected.</li>
                    <li><b>8.6</b> The maximum limit in percentage terms that is applicable is net of any sums recoverable by the Compensation Recovery Unit of the Department of Work and Pensions. The maximum limit (25%) is inclusive of any VAT charges at the prevailing rate.</li>
                    <li><b>8.7</b> The maximum limit, in percentage terms, only applies to a success fee for proceedings at first instance. The maximum limit would not apply, for example, to any Appeal by your opponent.</li>
                    <li><b>8.8</b> In the event of a dispute regarding the calculation of the success fee, the parties agree for the dispute to be determined by an independent barrister of at least 10 years call, to be appointed by agreement between us. In default of agreement, the barrister be appointed by the President of the Law Society of England and Wales, such barrister to act as expert, not arbitrator and his/her decision shall be binding. The barrister&apos;s fees are to be met by the losing party to the dispute.</li>
                  </ul>
                  <p><em>Guidance Note: Section 8</em></p>
                  <p><em>We calculate our success fee by taking the costs we have incurred and multiplying them by either 75% (if the case concludes before litigation) or 100% after litigation.</em></p>
                  <p><em>If we win, you will be liable for our success fee (if we cannot recover this from the other side). However, we guarantee that you will never have to pay more than 25% of any compensation you receive.</em></p>
                  <p><em>We will waive any amount that takes your success fee payment above this 25%. So, you will always receive 75% of any compensation awarded as long as you abide by our T&Cs.*</em></p>
                </div>
                <div className="mb-2">
                  <h3>9. Additional Information and Terms</h3>
                  <ul className="list-none">
                    <li><b>9.1</b> We add VAT at the prevailing rate that applies to the work when it has been carried out. VAT is added to the total of the basic charges and the success fee (however, the maximum success fee of 25% is inclusive of VAT). Our VAT registration number is 329824182 The parties acknowledge and agree that this Agreement is not a contentious Business Agreement within the meaning of the Solicitors Act 1974;</li>
                    <li><b>9.2</b> It may be that your opponent makes a Part 36 offer, or other formal offer to settle your claim, which you reject on our advice, and your claim for damages goes ahead to Trial where you recover damages that are less than that Offer. If this happens, we will not claim our basic charges and success fee for any work done after the expiry of the Part 36 Offer. However, in these circumstances, you may be ordered to pay your opponent&apos;s costs from the expiry of the Part 36 Offer. If your claim includes a claim for General Damages for Pain Suffering and Loss of Amenity, then any payment to your Opponent in costs, will be limited to the amount of damages and interest awarded to you, under the Qualified One-Way Costs Shifting Provisions;</li>
                    <li><b>9.3</b> The description of the Claim, as set out above and within the definitions, is for recognition purposes and does not in any way limit the ambit of this Agreement; the ambit of the retainer shall be taken to include all issues that the parties understood to be the subject of the Claim. The ambit may change from time to time, as the Claim progresses. For example, if an opponent is incorrectly described or if there are additional opponents added, after this Agreement was first made, the ambit of the Agreement will not be in any way limited by the fact that the description of the Claim as set out above, may not be wholly accurate and complete;</li>
                    <li><b>9.4</b> You have the right to apply to the Court for an assessment of our costs, including the success fee.</li>
                  </ul>
                </div>
              </div>
              {/* FORM OF AUTHORITY SECTION */}
              <h4 className="leading-[1.3] font-bold min-[575px]:text-[18px] text-[1rem] text-[#00b779] border-b-4 border-[#00b779] inline-block my-[30px]">FORM OF AUTHORITY</h4>
              <div className="scrollableBox mb-8 mt-4">
                <h4 className="text-[20px] font-semibold mb-2 text-gray-700">Instructions to act</h4>
                <p className="mb-2">I, <b>{details.firstName} {details.lastName}</b>, instruct KP Law Ltd to act on my behalf in relation to my claim for damages. I can confirm that I have not instructed any other firm of Solicitors to act on my behalf in relation to this incident and I will not do so.</p>
                <p className="mb-2">I can confirm that I have received and accept KP Law Ltd Terms and Conditions.</p>
                <p className="mb-2">I confirm that I agree to KP Law Ltd contacting me by post / email and sms for my claim communication and consent to my data being provided as part of my claim to those types of organisation listed on the quot; GDPR Consent Potential Third Parties document &quot; attached.</p>
                <h5 className="font-bold mt-4 mb-2">Fees</h5>
                <p className="mb-2">I understand that a success fee will be deducted from my compensation. This is called a success fee and is limited to 25% of my awarded/agreed damages and will be paid to KP Law Ltd Solicitors only if my claim reaches a successful conclusion.</p>
                <h5 className="font-bold mt-4 mb-2">Commencing the claim</h5>
                <p className="mb-2">I hereby authorise KP Law Ltd to commence the claim for damages by either submitting a Disclosure Request or a Letter of Claim to the Defendant.</p>
                <h5 className="font-bold mt-4 mb-2">Cheque Authority</h5>
                <p className="mb-2">I hereby consent to any cheques in respect of the damages claim to be made payable to KP Law Ltd and for KP Law Ltd to make any deductions that form part of the agreement with them from my damages.</p>
                <h5 className="font-bold mt-4 mb-2">Authority to issue Court proceedings/sign statement of truth</h5>
                <p className="mb-2">I hereby authorise KP Law Ltd to commence Court Proceedings on my behalf in such circumstances and in such a manner as they deem appropriate and, for this purpose, to sign on my behalf any Statement of Truth contained within those Proceedings.</p>
                <h5 className="font-bold mt-4 mb-2">Authority to perform an Anti-Money Laundering Check</h5>
                <p className="mb-2">I authorise KP Law Ltd to perform a check on me alongside my provision of sufficient photographic identification and proof of address dated within the last three months. The check is completed via a credit checking service and will leave a soft footprint on my credit history but will not affect my credit rating.</p>
                <p className="mb-2">I understand that KP Law Ltd are unable to proceed further with my claim without performing Anti-Money Laundering checks.</p>
                <h5 className="font-bold mt-4 mb-2">PLEASE NOTE:</h5>
                <p className="mb-2">When a data breach claim gets to Court, any information and evidence must be accessible and provided on request to be scrutinised. This means that claimants must keep all documentation and information that relates to their data breach claim in case it is needed.</p>
                <p className="mb-2">For this reason, as the action progresses, we may ask you to send us copies of any such relevant documentation so that we can securely hold this on your behalf in case it is required.</p>
                <h5 className="font-bold mt-4 mb-2">What documents might we need?</h5>
                <ul className="list-none mb-2">
                  <li>Evidence that you made a purchase with the Defendant or used the Defendant&apos;s services during the data breach period. This could be in a confirmation email, or accessible by logging into your online account (if you have one). You might even be able to trace this on a bank statement</li>
                  <li>Evidence that you were a customer/client of the Defendant&apos;s during the data breach period (e.g. where you didn&apos;t make a purchase, but your details were kept on file)</li>
                  <li>Evidence that your details have been affected (e.g. correspondence from the Defendant confirming that your data was breached)</li>
                  <li>A booking reference</li>
                  <li>Evidence of any financial losses, distress, and/or inconvenience you have suffered as a result of the data breach. For example:</li>
                  <ul className="list-disc pl-10">
                    <li>Bank statements</li>
                    <li>Correspondence (letters, emails, etc.) with banks, credit card providers, credit reference agencies, etc.</li>
                    <li>Credit score reports (with dates of any dips)</li>
                    <li>Details about medical appointments/prescriptions that relate to this data breach</li>
                    <li>Evidence of any fraudulent transactions, fraud attempts, alerts, cancelled cards that relate specifically to this data breach</li>
                    <li>Anything else that may be relevant to support your claim.</li>
                  </ul>
                </ul>
                <p className="mb-2">What if you can&apos;t provide this information to KP Law Ltd for safekeeping</p>
                <p className="mb-2">Where you are unable to send relevant documents to us, please ensure that you preserve them and do not dispose of the originals. This is important as, if you are requested to produce documents, but cannot as they have been disposed of, this could negatively impact your claim.</p>
                <p>If you have any queries, please contact us</p>
              </div>
              {/* CONSENT TO CFA/FOA/TERMS HEADER */}
              <h4 className="leading-[1.3] font-bold min-[575px]:text-[18px] text-[1rem] text-[#00b779] border-b-4 border-[#00b779] inline-block my-[30px]">CONSENT TO CFA/FOA/TERMS:</h4>
              <div className="font-bold text-[16px] mb-2">By signing your agreement(s) with KP Law Limited, you are confirming that you are happy to engage us in accordance with our terms and conditions.</div>
              <div className="font-bold text-[16px] mb-2">You also accept and agree to the above assessment of the risk on your case and the success fee that is then calculated from it.</div>
              <div className="flex items-center gap-6 mt-4 mb-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 border-2 rounded transition-colors duration-150 ${agreementAccepted === "yes"
                      ? "bg-[#00b779] border-[#00b779]"
                      : "bg-white border-[#00b779]"
                      } cursor-pointer`}
                    onClick={() => {
                      setAgreementAccepted("yes");
                      setAgreementError("");
                    }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={agreementAccepted === "yes"}
                    style={{ marginRight: "6px" }}
                  >
                    {agreementAccepted === "yes" && (
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" fill="none" />
                        <path d="M5 9.5L8 12.5L13 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[18px] font-normal">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 border-2 rounded transition-colors duration-150 ${agreementAccepted === "no"
                      ? "bg-[#00b779] border-[#00b779]"
                      : "bg-white border-[#00b779]"
                      } cursor-pointer`}
                    onClick={() => {
                      setAgreementAccepted("no");
                      setAgreementError("Sorry, we can not process your claim without the signed documents.");
                    }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={agreementAccepted === "no"}
                    style={{ marginRight: "6px" }}
                  >
                    {agreementAccepted === "no" && (
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" fill="none" />
                        <path d="M5 9.5L8 12.5L13 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[18px] font-normal">No</span>
                </label>
              </div>
              {agreementError && (
                <div className="border border-red-500 bg-white text-red-600 p-2 mb-2 text-[16px] rounded">
                  {agreementError}
                </div>
              )}
              {/* SIGNATURE & CONSENT SECTION */}
              <h3 className="text-[22px] font-bold mt-8 mb-2 text-[#00b779] border-b-4 border-[#00b779] inline-block pb-1">PLEASE SIGN HERE*</h3>
              <div className="mb-4">
                <div className="relative w-fit">
                  <SignatureCanvas
                    ref={sigPadRef}
                    penColor="#222"
                    backgroundColor="#fff"
                    canvasProps={{
                      width: canvasWidth,
                      height: canvasHeight,
                      className: "border rounded bg-white w-full max-w-[400px]",
                      style: { touchAction: 'none' }
                    }}
                    onEnd={() => {
                      try {
                        if (sigPadRef.current && typeof sigPadRef.current.getCanvas === 'function') {
                          const canvas = sigPadRef.current.getCanvas();
                          if (canvas && canvas.toDataURL) {
                            setSignature(canvas.toDataURL('image/png'));
                            setSignatureError("");
                          }
                        } else {
                          setSignatureError("Signature pad is not available.");
                        }
                      } catch (error) {
                        console.error('Error getting signature:', error);
                        setSignatureError("Error capturing signature. Please try again.");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded text-[15px]"
                    onClick={() => {
                      try {
                        if (sigPadRef.current && sigPadRef.current.clear) {
                          sigPadRef.current.clear();
                          setSignature("");
                          setSignatureError("Sorry, we can not process your claim without the signed documents.");
                        }
                      } catch (error) {
                        console.error('Error clearing signature:', error);
                      }
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {signatureError && (
                <div className="border border-red-500 bg-white text-red-600 p-2 mb-2 text-[16px] rounded">
                  {signatureError}
                </div>
              )}
              <a href="https://www.kpl-databreach.co.uk/terms-conditions-old/" target="_blank" className="text-blue-700 underline mb-4 inline-block">TERMS AND CONDITIONS</a>
              <br />
              {/* KP LAW 3RD PARTY OPTIN HEADER */}
              <h4 className="leading-[1.3] font-bold min-[575px]:text-[18px] text-[1rem] text-[#00b779] border-b-4 border-[#00b779] inline-block my-[30px]">KP LAW 3RD PARTY OPTIN</h4>
              <div className="font-bold text-[15px] mb-2 mt-2">
                From time to time KP Law Limited become aware of legal claims and other services being provided by different law firms or other similar types of businesses that may be relevant to you. Please tick the box below if you would like more information about these.
              </div>
              <div className="font-bold text-[15px] mb-2 mt-2">
                I would like you to let me know about legal services provided by other law firms or similar types of business that may be relevant to me. I understand that I can withdraw this consent at any time.
              </div>
              <div className="font-bold text-[15px]">
                For more information on what we do with your data and your rights in relation to your data, please see our <a href="https://www.kpl-databreach.co.uk/privacy-policy/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </div>
              <div className="flex items-center gap-6 mt-4 mb-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 border-2 rounded transition-colors duration-150 ${marketingConsent === "yes"
                      ? "bg-[#00b779] border-[#00b779]"
                      : "bg-white border-[#00b779]"
                      } cursor-pointer`}
                    onClick={() => setMarketingConsent("yes")}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={marketingConsent === "yes"}
                    style={{ marginRight: "6px" }}
                  >
                    {marketingConsent === "yes" && (
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" fill="none" />
                        <path d="M5 9.5L8 12.5L13 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[18px]">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 border-2 rounded transition-colors duration-150 ${marketingConsent === "no"
                      ? "bg-[#00b779] border-[#00b779]"
                      : "bg-white border-[#00b779]"
                      } cursor-pointer`}
                    onClick={() => setMarketingConsent("no")}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={marketingConsent === "no"}
                    style={{ marginRight: "6px" }}
                  >
                    {marketingConsent === "no" && (
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" fill="none" />
                        <path d="M5 9.5L8 12.5L13 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[18px]">No</span>
                </label>
              </div>
              {marketingError && (
                <div className="border border-red-500 bg-white text-red-600 p-2 mb-2 text-[16px] rounded">
                  {marketingError}
                </div>
              )}
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  className={`bg-[#00b779] hover:bg-[#009e6d] text-white text-[20px] font-bold px-[50px] py-[25px] rounded shadow min-w-[180px] transition-all w-full ${agreementAccepted === "yes" && signature.trim() && (marketingConsent === "yes" || marketingConsent === "no") ? '' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={agreementAccepted === "yes" && signature.trim() && (marketingConsent === "yes" || marketingConsent === "no") ? handleSubmit : undefined}
                  disabled={!(agreementAccepted === "yes" && signature.trim() && (marketingConsent === "yes" || marketingConsent === "no"))}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {/* Step 11: Thank You Page */}
          {step === 11 && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center py-4">
              <div className="bg-[#00b779] rounded-full w-14 h-14 flex items-center justify-center mb-6 mt-8">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2 className="text-[35px] font-bold mb-S">Thank You! We Are Reviewing Your Details.</h2>
              <p className="mb-4 mt-4 text-[16px]">One of our claim experts will be in touch shortly to discuss your potential claim and how much you could be owed.</p>
              <h2 className="text-[35px] font-bold mb-2">Have You Joined The PCP Claim?</h2>
              <p className="mb-2 mt-4 text-[16px]">If you&apos;ve had a car on finance since 2007, you could be eligible to
                claim £1,000s in compensation. <a href="https://www.pcpadvisors.co.uk/" className="text-blue-700 underline">Click here to get started.</a></p>
              <p className="mb-4 mt-4 text-[16px]">You will be directed to the website of The PCP Advisors, a trading style of The Claims Guys Legal. You are able to claim directly yourself for free to your lender, and then the Financial Ombudsman.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection; 