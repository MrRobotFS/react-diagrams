import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                {question}
            </div>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
};

const FAQs = ({ faqs }) => {
    const halfLength = Math.ceil(faqs.length / 2);
    const firstHalf = faqs.slice(0, halfLength);
    const secondHalf = faqs.slice(halfLength);

    return (
        <>
        <h1>FAQS Section</h1>
        <div className="faqs-container">
            <div className="faqs-column">
                {firstHalf.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
            <div className="faqs-column">
                {secondHalf.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
        </>
    );
};


export default FAQs;
