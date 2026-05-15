import React from 'react';
import SpecificationsTable from '../SpecificationsTable/SpecificationsTable';
import CareInstructions from '../CareInstructions/CareInstructions';
import './productSpecifications.css';

// Importing local icons correctly based on previous setup
import dropIcon from '../../../../assets/icons/ui/drop.png';
import flowerIcon from '../../../../assets/icons/ui/flower.png';
import coolIcon from '../../../../assets/icons/ui/cool.png';
import chemicalIcon from '../../../../assets/icons/ui/chemical.png';
import handIcon from '../../../../assets/icons/ui/hand.png';

interface SpecItem {
    label: string;
    value: string;
}

interface ProductSpecificationsProps {
    specifications: SpecItem[];
    services: any[];
}

const ProductSpecifications = ({ specifications, services }: ProductSpecificationsProps) => {
    // Map API Data to Specifications format (new array structure)
    const specificationsData = (specifications || []).map((item: SpecItem) => ({
        label: item.label,
        value: item.value
    }));

    // Map API Data (services/care instructions) to the expected format
    const careInstructionsData = (services || []).map((item: any, index: number) => ({
        // Safely handle both string and object {title: '...'} formats
        text: typeof item === 'object' ? (item.title || JSON.stringify(item)) : item,
        // Cycle through local icons for a rich look
        icon: [dropIcon, flowerIcon, coolIcon, chemicalIcon, handIcon][index % 5]
    }));

    return (
        <div className="product-specifications-section mt-2 mb-4 pb-4">
            <div className="product-specifications-wrapper d-flex flex-column">

                {/* Heading */}
                <h2 className="specifications-heading" style={{ fontSize: '20px', marginBottom: '15px' }}>Product Specifications</h2>

                {/* Specs Table */}
                <div className="specifications-table-container">
                    <SpecificationsTable specs={specificationsData} />
                </div>

                {/* Care Instructions Section */}
                <div className="care-instructions-container mt-3">
                    <CareInstructions instructions={careInstructionsData} />
                </div>

            </div>
        </div>
    );
};

export default ProductSpecifications;
