"use client";
import React, { useRef, useEffect } from "react";

interface PersonalDetails {
  title: string;
  firstName: string;
  lastName: string;
  postcode: string;
  mobileNumber: string;
  emailAddress: string;
}

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  errors: { firstName: string; lastName: string };
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
}

const PersonalDetailsForm = ({
  details,
  errors,
  onDetailsChange,
  onNext
}: PersonalDetailsFormProps) => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  // Check if form is valid
  const isFormValid = () => {
    return details.firstName.trim().length >= 2 &&
      details.lastName.trim().length >= 2 &&
      details.postcode.trim().length >= 0 &&
      details.mobileNumber.trim().length >= 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.emailAddress.trim()) &&
      Object.values(errors).every(error => !error);
  };

  return (
    <div className="pt-[1rem] min-[575px]:pt-[20px] min-[575px]:mt-[20px] personal-Details eligibility">
      <h1 ref={headerRef} className="
       max-[575px]:text-[28px] text-[45px]
       leading-[0.9] tracking-[-0.03em] 
       text-[#0a0a0a] 
       min-[575px]:pt-[35px] 
       font-[700] 
       text-left 
       ">Your details</h1>
      <p className="
      my-[15px] 
      text-[16px] leading-[1.5rem] 
      max-[575px]:text-[15px]
      ">Who should we send your discount to?</p>

      <div className="mb-4 flex flex-col">
        <div className="form-group mb-4">
          <input
            ref={firstNameRef}
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            onBlur={onDetailsChange}
            className={`w-full border rounded px-3 py-4 mb-[.25rem] text-[17px] max-[575px]:text-[14px] ${errors.firstName ? 'border-red-500' : ''} first-last-input`}
            autoComplete="given-name"
          />
         
        </div>
        <div className="form-group mb-4">
          <input
            ref={surnameRef}
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            onBlur={onDetailsChange}
            onFocus={() => {
              firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`w-full border rounded px-3 py-4 text-[17px] max-[575px]:text-[14px] ${errors.lastName ? 'border-red-500' : ''} first-last-input`}
            autoComplete="family-name"
          />
        
        </div>
        <div className="form-group mb-4">
          <input
            ref={postcodeRef}
            type="text"
            id="postCode"
            name="postCode"
            placeholder="Postcode"
            onBlur={onDetailsChange}
            className={`w-full border rounded px-3 py-4 text-[17px] max-[575px]:text-[14px]`}
              autoComplete="postal-code"
          />
        
        </div>
        <div className="form-group mb-4">
          <input
            ref={postcodeRef}
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            placeholder="Mobile Number"
            onBlur={onDetailsChange}
            className={`w-full border rounded px-3 py-4 text-[17px] max-[575px]:text-[14px]`}
          />
        
        </div>
        <div className="form-group mb-4">
          <input
            ref={postcodeRef}
            type="text"
            id="emailAddress"
            name="emailAddress"
            placeholder="Email address"
            onBlur={onDetailsChange}
            className={`w-full border rounded px-3 py-4 text-[17px] max-[575px]:text-[14px]`}
          />
        
        </div>
      </div>



      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={isFormValid() ? onNext : undefined}
          disabled={!isFormValid()}
          className={`pa max-[575px]:w-full w-auto max-[575px]:px-[30px] max-[575px]:py-20px] px-[50px] py-[25px] mt-[10px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779]  transition-opacity ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
           {(errors.firstName ||errors.lastName)&& <div className="text-600 text-[17px] mt-1">First and last name must be at least 2 characters long!</div>}
          {!errors.firstName &&!errors.lastName && <p>Get Discount</p>}
        </button>
      </div>

      <div className="mt-4 text-right text-[16px]">
        <span className="inline-block align-middle mr-1" style={{ verticalAlign: 'middle' }}>
          <svg width="24" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="10" stroke="#00b779" strokeWidth="2" fill="#00b779" />
            <path d="M7 11.5L10 15.5L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <strong>  Check your eligibility.</strong>
      </div>
    </div>
  );
};

export default PersonalDetailsForm; 