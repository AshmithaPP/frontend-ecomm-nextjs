import React from 'react';
import TopBar from 'components/layout/TopBar/TopBar';
import Navbar from 'components/layout/Navbar/Navbar';
import Footer from 'components/layout/Footer/Footer';
import CartDrawer from 'features/cart/components/CartDrawer/CartDrawer';
import ChatBot from 'components/ui/ChatBot/ChatBot';
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
            <CartDrawer />
            <ChatBot />
        </div>
    );
};

export default Layout;
