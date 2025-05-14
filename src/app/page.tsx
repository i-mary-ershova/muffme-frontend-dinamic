import React, { Suspense } from 'react';
import MainHero from '@/components/MainHero';
import DessertSection from '@/components/DessertSection';
import Marquee from '@/components/Marquee';
import PromoBanner from '@/components/PromoBanner';

export default async function Home() {
    return (
        <main>
            <MainHero>
                <Suspense fallback={
                    <div style={{ 
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 20px'
                    }}>
                        <div style={{ 
                            width: '100%',
                            height: '300px',
                            borderRadius: '30px',
                            backgroundColor: '#f8f8f8',
                            position: 'relative',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                            animation: 'pulse 1.5s infinite ease-in-out'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#8B0000',
                                fontFamily: 'Alegreya, serif',
                                fontSize: '24px',
                                fontWeight: 500
                            }}>
                                Загрузка акций...
                            </div>
                        </div>
                    </div>
                }>
                    <PromoBanner />
                </Suspense>
            </MainHero>
            <Marquee />
            <DessertSection />
        </main>

    );
}
