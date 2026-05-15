"use client";

import React from 'react';
import './specificationsTable.css';

interface Spec {
    label: string;
    value: string;
}

interface SpecificationsTableProps {
    specs: Spec[];
}

const SpecificationsTable = ({ specs }: SpecificationsTableProps) => {
    return (
        <div className="specifications-table row m-0">
            {specs.map((spec, index) => (
                <div className="col-lg-6 col-12 spec-cell px-0" key={index}>
                    <div className="spec-row-content d-flex align-items-center">
                        <span className="spec-label">{spec.label}</span>
                        <span className="spec-value">{spec.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpecificationsTable;
