"use client";

import React from 'react';
import './ContactHero.css';
import Image from 'next/image';
import contactus from 'assets/images/contactus/contactus.png';

const ContactHero = () => {
    return (
        <section className="contact_hero_section">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-6 contact_hero_left">
                        <p className="contact_hero_eyebrow">LEGACY OF THE LOOM</p>
                        <h1 className="contact_hero_title">Timeless Tradition Woven in Silk</h1>
                        <p className="contact_hero_subtext">
                            Celebrating the heritage of authentic Kanchipuram silk sarees crafted by
                            master weavers through generations of sacred geometry and golden threads.
                        </p>
                        <button className="contact_hero_btn">Explore Collections</button>
                    </div>
                    <div className="col-md-6 contact_hero_right d-none d-md-flex">
                        <Image src={contactus} alt="Saree Model" className="contact_hero_img img-fluid" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
