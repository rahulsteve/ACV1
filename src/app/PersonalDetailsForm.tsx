"use client";
import React from "react";

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
    <div className="mt-8 eligibility">
      <h2 className="text-[32px] font-bold mb-2">Your personal details</h2>
      <p className="mb-4">Please tell us who is claiming</p>
      
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title</label>
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
      
      <div className="mb-4 flex flex-col gap-4">
        <div className="w-full">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={details.firstName}
            onChange={onDetailsChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
        </div>
        <div className="w-full">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={details.lastName}
            onChange={onDetailsChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
        </div>
      </div>
      
      <div className="mb-4">
      <label className="block font-semibold mb-1">Date of birth</label>
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
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
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
          className={`pa w-full px-[50px] py-[25px] mt-[10px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] bg-[#00b779] bg-no-repeat bg-[url('https://quiz-live.s3.amazonaws.com/upload/cavis-limited/right-arrow-1742548055036.png')] bg-[right_32%_center] bg-[length:20px] max-[1199px]:bg-[right_30%_center] max-[767px]:bg-[right_30%_center] max-[698px]:bg-[right_25%_center] max-[575px]:bg-none transition-opacity ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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