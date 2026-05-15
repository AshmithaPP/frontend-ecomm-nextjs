"use client";

import React from "react";
import "./Mastersvoice.css";
import Image from "next/image";
import weaverPortrait from "assets/images/weaver_portrait.png";

const Mastersvoice = () => {
  return (
    <section className="mastersvoice-section">
      <div className="mastersvoice-inner">

        {/* LEFT — Text Content */}
        <div className="mastersvoice-left">

          {/* Olive label */}
          <p className="mastersvoice-label">A Master's Voice</p>

          {/* Large maroon quote */}
          <blockquote className="mastersvoice-quote">
            "For me, the silk thread is not just material; it's a lifeline.
            Every knot I tie carries the wisdom of my grandfather and the hope
            of my grandson."
          </blockquote>

          {/* Weaver name */}
          <p className="mastersvoice-name">Srinivasan Mudaliar</p>

          {/* Subtitle */}
          <p className="mastersvoice-title">Master Weaver of 42 Years</p>

          {/* Thin rule */}
          <div className="mastersvoice-divider" aria-hidden="true" />

          {/* Body copy */}
          <p className="mastersvoice-body">
            Srinivasan is one of our 120 partner weavers. His expertise in the
            'Aayiram Butta' (Thousand Buttas) pattern is legendary in
            Kanchipuram. By choosing Heritage Weaves, you ensure his legacy
            continues.
          </p>

        </div>

        {/* RIGHT — Photo with red badge */}
        <div className="mastersvoice-right">
          <Image
            src={weaverPortrait}
            alt="Srinivasan Mudaliar, Master Weaver of 42 Years"
            className="mastersvoice-photo"
          />

          {/* Red badge */}
          <div className="mastersvoice-badge" aria-label="40+ Years of Expertise">
            <p className="mastersvoice-badge-number">40+</p>
            <p className="mastersvoice-badge-text">Years of<br />Expertise</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Mastersvoice;
