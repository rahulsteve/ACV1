"use client";
import React, { useRef, useEffect } from "react";

const TITLES = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Rev", "Dame", "Lady", "Sir", "Lord", "Mx"];

interface PersonalDetails {
  title: string;
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
}

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  errors: { firstName: string; lastName: string; dob: string };
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

  useEffect(() => {
    setTimeout(() => {
      headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  // Check if form is valid
  const isFormValid = () => {
    return details.title &&
      details.firstName.trim().length >= 2 &&
      details.lastName.trim().length >= 2 &&
      details.day &&
      details.month &&
      details.year &&
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
       ">Your personal details</h1>
      <p className="
      my-[15px] 
      text-[16px] leading-[1.5rem] 
      max-[575px]:text-[15px]
      ">Please tell us who is claiming</p>

      <div className="mb-4">
        <h3 className="text-[23px] font-[700] mb-2 min-[575px]:my-[20px]">Title</h3>
        <select
          name="title"
          value={details.title}
          onChange={onDetailsChange}
          onBlur={() => onDetailsChange}
          className="w-[40%] border rounded px-3 py-2 mt-[.35em] max-[575px]:w-[50%]"
          required
        >
          <option value="">------</option>
          {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

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
      </div>

      <div className="mb-4">
        <h3 className="text-[23px] font-[700] mb-[25px]">Date of birth</h3>
        <div className="flex flex-row gap-2">
          <select
            name="day"
            value={details.day}
            onChange={onDetailsChange}
            className="border rounded px-2 py-2 w-1/3 text-[17px] max-[575px]:text-[14px]"
            required
          >
            <option value="">DD</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select
            name="month"
            value={details.month}
            onChange={onDetailsChange}
            className="border rounded px-2 py-2 w-1/3 text-[17px] max-[575px]:text-[14px]"
            required
          >
            <option value="">MM</option>
            {[
              { value: '1', label: 'Jan' },
              { value: '2', label: 'Feb' },
              { value: '3', label: 'Mar' },
              { value: '4', label: 'Apr' },
              { value: '5', label: 'May' },
              { value: '6', label: 'Jun' },
              { value: '7', label: 'Jul' },
              { value: '8', label: 'Aug' },
              { value: '9', label: 'Sept' },
              { value: '10', label: 'Oct' },
              { value: '11', label: 'Nov' },
              { value: '12', label: 'Dec' },
            ].map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            name="year"
            value={details.year}
            onChange={onDetailsChange}
            className="border rounded px-2 py-2 w-1/3 text-[17px] max-[575px]:text-[14px]"
            required
          >
            <option value="">YYYY</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i - 18).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {errors.dob &&details.year &&details.month&&details.day && <div className="text-red-600  text-[17px] mt-1">{errors.dob}</div>} 
      
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={isFormValid() ? onNext : undefined}
          disabled={!isFormValid()}
          className={`pa max-[575px]:w-full w-auto max-[575px]:px-[30px] max-[575px]:py-20px] px-[50px] py-[25px] mt-[10px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779]  transition-opacity ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
           {(errors.firstName ||errors.lastName)&& <div className="text-600 text-[17px] mt-1">First and last name must be at least 2 characters long!</div>}
          {!errors.firstName &&!errors.lastName && <p>Next</p>}
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