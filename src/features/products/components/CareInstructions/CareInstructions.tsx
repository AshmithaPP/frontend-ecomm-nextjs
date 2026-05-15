"use client";

import React from 'react';
import './careInstructions.css';
import Image from 'next/image';

interface Instruction {
    text: string;
    icon: any;
}

interface CareInstructionsProps {
    instructions: Instruction[];
}

const CareInstructions = ({ instructions }: CareInstructionsProps) => {
    return (
        <div className="care-instructions-wrapper w-100">
            {/* Tabs Row */}
            <div className="care-tabs d-flex">
                <div className="care-tab active-tab">
                    Care Instructions
                </div>
                <div className="care-tab inactive-tab ms-4">
                    Shipping & Returns
                </div>
                <div className="care-tab inactive-tab ms-4">
                    Authenticity
                </div>
            </div>

            {/* Tab Content */}
            <div className="care-content mt-4">
                <ul className="care-list list-unstyled m-0">
                    {instructions.map((item, index) => (
                        <li key={index} className="care-item d-flex align-items-center mb-3">
                            <Image src={item.icon} alt="Care Icon" className="care-icon me-3" width={24} height={24} />
                            <span className="care-text">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CareInstructions;
