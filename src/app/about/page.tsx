"use client";

import React from 'react';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import AboutSectionTwo from 'features/about/components/AboutSectionTwo/AboutSectionTwo';
import Heritageofkanchipuram from 'features/about/components/AboutSectionTwo/AboutSectionThree/Heritageofkanchipuram';
import TrustedHeritage from 'features/about/components/TrustedHeritage/TrustedHeritage';
import Mastersvoice from 'features/about/components/Mastersvoice/Mastersvoice';

const AboutPage = () => {
    return (
        <div className="about-page">
            <ContactHero />
            <AboutSectionTwo />
            <Heritageofkanchipuram />
            <TrustedHeritage />
            <Mastersvoice />
            <Testimonials />
            <NewsletterSection />
        </div>
    );
};

export default AboutPage;
