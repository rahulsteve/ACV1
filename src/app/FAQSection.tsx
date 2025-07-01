"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "How do I know if I&apos;m eligible for compensation?",
    answer: (
      <>If you have bought, sold or had a car serviced by Arnold Clark in the last 10 years or worked for Arnold Clark during this period, you could be eligible to make a no win, no fee compensation claim.</>
    ),
  },
  {
    question: "How much compensation could I claim?",
    answer: (
      <>There is not a set compensation amount for each claim. Different factors determine how much compensation you could be owed and the law firm handling your claim will be able to provide you specific details relating to your case.</>
    ),
  },
  {
    question: "How did the security incident happen?",
    answer: (
      <>Arnold Clark experienced a cyber security incident on 23rd December 2022. It was issued with a multimillion-pound ransom demand from the Play ransomware cartel. A 15GB tranche of stolen customer data was allegedly shared on the dark web, with another, much larger upload threatened if the cryptocurrency ransom was not paid. The cybercriminals then carried out their threat and released another 30 gigabytes of data on the dark web.</>
    ),
  },
  {
    question: "What data was breached?",
    answer: (
      <>
        The list of potentially compromised data includes customer:
        <ul>
          <li>National Insurance numbers</li>
          <li>Dates of birth</li>
          <li>Phone numbers</li>
          <li>Emails</li>
          <li>Copies of passports</li>
          <li>Home addresses</li>
          <li>Bank account and sort code details</li>
        </ul>
      </>
    ),
  },
  {
    question: "What has Arnold Clark said about the breach?",
    answer: (
      <>
        On 3 January 2023, 11 days after the cyberattack, Arnold Clark said: <br /><br />
        <i>
          Late on the evening of 23rd December, the Group was notified by our external cyber security consultants of suspicious traffic on our network. Once we confirmed this internally with our own Cyber team, we made the decision to bring down our network voluntarily as a purely protective measure, which has resulted in us cutting connectivity to the internet, our dealerships and our third-party connections.
        </i>
        <br /><br />
        <i>
          Our priority has been to protect our customers&apos; data, our systems and our third-party partners. While this has been acheived, this action has caused temporary disruption to our business and unfortunately our customers.
        </i>
        <br /><br />
        <i>
          Our external security partners have now been performing an extensive review of our whole IT network and infrastructure, which is a mammoth task, and they are providing guidance to our IT team on the re-enabling of our network and systems in a safe, secure and phased manner.
        </i>
        <br /><br />
        <i>
          Our showrooms and branches are open and will be able to assist our customers using our temporary systems until we have been able to restore our full systems safely. We expect to resume customer vehicle collections later this week and our branches are contacting customers to arrange this.
        </i>
        <br /><br />
        <i>
          Once again, we would like to thank our customers for their understanding and to apologise for any inconvenience this has caused.
        </i>
        <br /><br />
        On 28 January 2023, Arnold Clark released a further statement about the attack. In this, the company appeared to admit that, while its IT systems were capable of being set up so that they were not vulnerable to external attacks (a segregated environment), work to achieve this had only just begun.
      </>
    ),
  },
  {
    question: "Was my information accessed in this breach?",
    answer: (
      <>
        The volume of data at risk leads us to believe that any customer of Arnold Clark in the last ten years has a high probability of their information being accessed.<br /><br />
        Arnold Clark is writing to all affected and potentially affected customers and will continue that communication as its investigation progresses.
      </>
    ),
  },
  {
    question: "What should I do if I am worried that my details were involved in this breach?",
    answer: (
      <>
        Anyone who thinks they might be involved should take immediate steps to protect themselves.&nbsp;
        <a
          href="https://www.kpl-databreach.co.uk/a-quick-guide-to-staying-safe-after-a-data-breach/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find out how to do this here
        </a>.
      </>
    ),
  },
  {
    question: "Can I make a compensation claim?",
    answer: (
      <>
        If you live in England or Wales and you are involved in this breach, you may be able to join our no-win, no-fee compensation claim. There are no costs to register and no obligation to proceed.
      </>
    ),
  },
  {
    question: "What is a group action?",
    answer: (
      <>
        A group action claim is where a group of people – sometimes even thousands of people – have been affected by the same issue. Group action cases are also known as class actions, multi-claimant, or multi-party actions.
      </>
    ),
  },
  {
    question: "How much will it cost me to claim?",
    answer: (
      <>
        There are no costs to join a claim. However, if your claim is successful, you may have to pay a &apos;success fee&apos;. This fee is taken from the compensation awarded to you. At KP Law, our success fee is competitive, and we make sure you are fully informed about any potential costs before you officially join our action. If you lose, you won&apos;t have to pay a penny.
      </>
    ),
  },
];

const FAQSection = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleToggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="frequently_section">
      <div className="container_inner">
        <div className="frequently_inner">
          <h2>Frequently asked questions</h2>
          <div className="faq-container">
            {faqs.map((faq, idx: number) => (
              <div
                className={`faq-item${openIndices.includes(idx) ? " active" : ""}`}
                key={idx}
              >
                <div
                  className="faq-question"
                  onClick={() => handleToggle(idx)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={openIndices.includes(idx)}
                  aria-controls={`faq-answer-${idx}`}
                >
                  {faq.question}
                </div>
                <div
                  className="faq-answer"
                  id={`faq-answer-${idx}`}
                  style={{ display: openIndices.includes(idx) ? "block" : "none" }}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;

