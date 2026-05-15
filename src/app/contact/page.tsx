"use client";

import React from 'react';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import ContactFeatures from 'features/contact/components/ContactFeatures/ContactFeatures';
import ContactForm from 'features/contact/components/ContactForm/ContactForm';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <ContactHero />
            <ContactFeatures />
            <ContactForm />
            <NewsletterSection />
        </div>
    );
};

export default ContactPage;
