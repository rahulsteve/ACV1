"use client";
import React, { useRef, useEffect } from "react";

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"];

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
           details.firstName.trim().length >= 3 && 
           details.lastName.trim().length >= 3 && 
           details.day && 
           details.month && 
           details.year &&
           Object.values(errors).every(error => !error);
  };

  return (
    <div className="mt-8 personal-Details eligibility">
      <h1 ref={headerRef} className="text-[32px] max-[575px]:text-[28px] font-bold mb-2">Your personal details</h1>
      <p className="mb-4">Please tell us who is claiming</p>
      
      <div className="mb-4">
        <h3 className="block font-semibold mb-1">Title</h3>
        <select
          name="title"
          value={details.title}
          onChange={onDetailsChange}
          className="w-1/2 border rounded px-3 py-2"
          required
        >
          <option value="">------</option>
          {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      
      <div className="mb-4 flex flex-col">
        <div className="form-group mb-4">
        <label htmlFor="firstName" className="block mb-1 font-semibold">First Name</label>

          <input
            ref={firstNameRef}
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={details.firstName}
            onChange={onDetailsChange}
            className={`w-full border rounded px-3 py-4 text-[20px] max-[575px]:text-[15px] ${errors.firstName ? 'border-red-500' : ''}`}
            autoComplete="given-name"
          />
          {errors.firstName && <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>}
        </div>
        <div className="form-group mb-4">
        <label htmlFor="lastName" className="block mb-1 font-semibold">Last Name</label>

          <input
            ref={surnameRef}
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={details.lastName}
            onChange={onDetailsChange}
            onFocus={() => {
              firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`w-full border rounded px-3 py-4 text-[20px] max-[575px]:text-[15px] ${errors.lastName ? 'border-red-500' : ''}`}
            autoComplete="family-name"
          />
          {errors.lastName && <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>}
        </div>
      </div>
      
      <div className="mb-4">
      <h3 className="block font-semibold mb-1">Date of birth</h3>
        <div className="flex flex-row gap-2">
          <select
            name="day"
            value={details.day}
            onChange={onDetailsChange}
            className="border rounded px-2 py-2 w-1/3"
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
            className="border rounded px-2 py-2 w-1/3"
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
            className="border rounded px-2 py-2 w-1/3"
            required
          >
            <option value="">YYYY</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i - 18).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob}</div>}
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={isFormValid() ? onNext : undefined}
          disabled={!isFormValid()}
          className={` next-btn pa max-[575px]:w-full w-1/3 px-[50px] py-[25px] mt-[10px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779]  transition-opacity ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Next
        </button>
      </div>
      
      <div className="mt-4 text-left text-[16px]">
        <span className="inline-block align-middle mr-1" style={{ verticalAlign: 'middle' }}>
          <svg width="24" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="10" stroke="#00b779" strokeWidth="2" fill="#00b779"/>
            <path d="M7 11.5L10 15.5L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <strong>  Join 10,000+ signed claimants.</strong>
      </div>
    </div>
  );
};

export default PersonalDetailsForm; 