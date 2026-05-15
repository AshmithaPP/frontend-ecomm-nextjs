import React from 'react';
import TopBar from 'components/layout/TopBar/TopBar';
import Navbar from 'components/layout/Navbar/Navbar';
import Footer from 'components/layout/Footer/Footer';
import './Layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="layout-container">
            <TopBar />
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
