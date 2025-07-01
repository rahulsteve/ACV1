"use client";
import React from "react";
import './globals.css';

const initialDetails = {
  title: '',
  firstName: '',
  lastName: '',
  day: '',
  month: '',
  year: '',
};

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"];

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

const MainSection = ({ step, setStep, exited, setExited }: MainSectionProps) => {
  const [answers, setAnswers] = React.useState({
    q1: '', q2: '', q2a: '', q3: '', q4: ''
  });
  const [details, setDetails] = React.useState(initialDetails);
  const [errors, setErrors] = React.useState({ firstName: '', lastName: '', dob: '' });

  // Handlers for each step
  const handleAnswer = (q: string, value: string) => {
    let nextStep = step + 1;
    const newAnswers = { ...answers, [q]: value };

    // Logic for navigation
    if (q === 'q2') {
      if (value === 'Yes') {
        nextStep = 4; // Go to Q3
      } else {
        nextStep = 3; // Go to Q2A
      }
    }
    if (q === 'q2a' && value === 'No') {
      setExited(true); return;
    }
    if (q === 'q2a' && value === 'Yes') {
      nextStep = 4; // Go to Q3
    }
    if (q === 'q3' && value === 'Yes') {
      setExited(true); return;
    }
    setAnswers(newAnswers);
    setStep(nextStep);
  };

  // Personal details validation
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateDetails = () => {
    let valid = true;
    const newErrors = { firstName: '', lastName: '', dob: '' };
    if (details.firstName.trim().length < 3) {
      newErrors.firstName = 'First name must be more than 2 characters.';
      valid = false;
    }
    if (details.lastName.trim().length < 3) {
      newErrors.lastName = 'Last name must be more than 2 characters.';
      valid = false;
    }
    if (!isOver18(details.day, details.month, details.year)) {
      newErrors.dob = 'You must be over 18 years old.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      alert('Eligibility check complete!');
      // Here you would handle the actual submission
    }
  };

  // Step content
  if (exited) {
    return (
      <section>
        <div className="mx-auto max-w-[700px] container_inner text-center  mt-6">
          <br />
          <br />
          <p>
            <img height={78} width={78} src="https://static.leadshook.io/upload/cavis-limited/close%20(2)-1742908286780.png" alt="" className="mx-auto mb-4" />
          </p>
          <h2 className="text-[35px] font-bold leading-[1.2] tracking-[-0.7px] pt-[10px] mb-4">Sorry! Based on the answers provided <br />
            you do not qualify for this claim.
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="w-full banner_section ">
        <div className="mx-auto max-w-[700px] max-[480px]:px-[15px] px-[10px] max-[1199px]:px-[30px] container_inner">
          {step === 1 && (
            <h1 className="pt-12 text-[43px] leading-[0.9] tracking-[-0.03em] md:tracking-[-0.01em] text-[#0a0a0a] pt-[35px] max-[480px]:pt-[30px] max-[480px]:text-[28px] max-[575px]:text-[35px] font-bold text-left">
              Join The <span className="textBG">Arnold Clark</span> Data<br />
              <span className="relative inline-block z-[1]">Breach Claim</span>
            </h1>
          )}
            {step === 1 && (
          <p className="mt-4 mb-4 text-left max-[575px]:text-[15px] leading-[16px]">
            Join <strong><u>10,000+</u></strong> signed claimants who could be eligible for compensation following the Arnold Clark data breach. Use our free online tool to check your eligibility.
          </p>)}

          {/* Step 1 */}
          {step === 1 && (
            <div className="button_section mt-6">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] text-[#0a0a0a]">
                Have you been notified by Arnold Clark that your data may have been
                breached?
              </h2>

              <div className="flex gap-[15px] button_row">
                <div className="button_cal w-1/2">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio1"
                    name="have_you_been_notified"
                    value="Yes"
                    onClick={() => handleAnswer('q1', 'Yes')}
                    required
                  />
                  <label htmlFor="radio1">Yes</label>
                </div>
                <div className="button_cal w-1/2">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio2"
                    name="have_you_been_notified"
                    value="No"
                    onClick={() => handleAnswer('q1', 'No')}
                    required
                  />
                  <label htmlFor="radio2">No</label>
                </div>
              </div>

              <div className="button_box w-full">
                <input
                  type="submit"
                  value="Check Your Eligibility"
                  className="pa w-full
                             px-[50px] py-[21.5px] mt-[10px]
                             text-white text-[20px] font-bold
                             border-2 border-[#008f5f]
                             rounded-[5px] cursor-pointer
                             bg-[#00b779] bg-no-repeat
                             bg-[url('https://quiz-live.s3.amazonaws.com/upload/cavis-limited/right-arrow-1742548055036.png')]
                             bg-[right_32%_center]
                             bg-[length:20px]
                             max-[1199px]:bg-[right_30%_center]
                             max-[767px]:bg-[right_30%_center]
                             max-[698px]:bg-[right_25%_center]
                             max-[575px]:bg-none"
                />

                <button className="next-btn hidden" id="next-btn"></button>
              </div>
            </div>


          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="button_section mt-6">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] py-12">
                Have you purchased, sold, rented, hired, or leased a vehicle, or had any servicing or repairs carried out by Arnold Clark, or been an employee of Arnold Clark between 2012 and 2022?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio3"
                    name="have_you_purchased_vehicle"
                    value="Yes"
                    onClick={() => handleAnswer('q2', 'Yes')}
                    required
                  />
                  <label htmlFor="radio3">Yes</label>
                </div>
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio4"
                    name="have_you_purchased_vehicle"
                    value="No"
                    onClick={() => handleAnswer('q2', 'No')}
                    required
                  />
                  <label htmlFor="radio4">No</label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 (Q2A) */}
          {step === 3 && (
            <div className="button_section mt-6">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] ">
                Have you kept a copy of the email or notification?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio5"
                    name="kept_copy_notification"
                    value="Yes"
                    onClick={() => handleAnswer('q2a', 'Yes')}
                    required
                  />
                  <label htmlFor="radio5">Yes</label>
                </div>
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio6"
                    name="kept_copy_notification"
                    value="No"
                    onClick={() => handleAnswer('q2a', 'No')}
                    required
                  />
                  <label htmlFor="radio6">No</label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 (Q3) */}
          {step === 4 && (
            <div className="button_section mt-6">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] ">
                Did you live in Scotland when the purchase was made or when you were employed by Arnold Clark?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio7"
                    name="lived_in_scotland"
                    value="Yes"
                    onClick={() => handleAnswer('q3', 'Yes')}
                    required
                  />
                  <label htmlFor="radio7">Yes</label>
                </div>
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio8"
                    name="lived_in_scotland"
                    value="No"
                    onClick={() => handleAnswer('q3', 'No')}
                    required
                  />
                  <label htmlFor="radio8">No</label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 (Q4) */}
          {step === 5 && (
            <div className="button_section mt-6">
              <h2 className="leading-[1.3] text-[24px] font-semibold mt-0 mb-[20px] ">
                Have you suffered distress and/or anxiety upon learning that your sensitive and confidential information may have been stolen?
              </h2>
              <div className="flex flex-col gap-[15px] button_row">
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio9"
                    name="suffered_distress"
                    value="Yes"
                    onClick={() => handleAnswer('q4', 'Yes')}
                    required
                  />
                  <label htmlFor="radio9">Yes</label>
                </div>
                <div className="button_cal w-full">
                  <input
                    className="hidden"
                    type="radio"
                    id="radio10"
                    name="suffered_distress"
                    value="No"
                    onClick={() => handleAnswer('q4', 'No')}
                    required
                  />
                  <label htmlFor="radio10">No</label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Personal Details */}
          {step === 6 && (
            <form className="mt-8" onSubmit={handleSubmit} autoComplete="off">
              <h2 className="text-[32px] font-bold mb-2">Your personal details</h2>
              <p className="mb-4">Please tell us who is claiming</p>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <select
                  name="title"
                  value={details.title}
                  onChange={handleDetailsChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">------</option>
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-4 flex gap-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={details.firstName}
                    onChange={handleDetailsChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={details.lastName}
                    onChange={handleDetailsChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Date of birth</label>
                <div className="flex gap-2">
                  <select
                    name="day"
                    value={details.day}
                    onChange={handleDetailsChange}
                    className="border rounded px-2 py-2"
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
                    onChange={handleDetailsChange}
                    className="border rounded px-2 py-2"
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
                    onChange={handleDetailsChange}
                    className="border rounded px-2 py-2"
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
                <input
                  type="submit"
                  value="Check Your Eligibility"
                  className="pa w-full px-[50px] py-[25px] mt-[10px] text-white text-[20px] font-bold border-2 border-[#008f5f] rounded-[5px] cursor-pointer bg-[#00b779] bg-no-repeat bg-[url('https://quiz-live.s3.amazonaws.com/upload/cavis-limited/right-arrow-1742548055036.png')] bg-[right_32%_center] bg-[length:20px] max-[1199px]:bg-[right_30%_center] max-[767px]:bg-[right_30%_center] max-[698px]:bg-[right_25%_center] max-[575px]:bg-none"
                />
              </div>
              <div className="mt-4 text-left text-[16px]">
                <span className="text-green-600 font-bold">✔</span> Join <strong>10,000+</strong> signed claimants.
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection; 