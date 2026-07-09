import React from 'react';
import { Download } from 'lucide-react';

const AnimatedStatsCard = ({ value = "359k", label = "Downloads" }) => {
    return (
        <div
            className="w-[300px] h-[250px] rounded-[10px] p-[1px] relative overflow-hidden"
            style={{ background: 'radial-gradient(circle 230px at 0% 0%, #ffffff, #0c0d0d)' }}
        >
            <div
                className="absolute bg-white rounded-full z-[2] w-[5px] h-[5px] animate-moveDot"
                style={{
                    boxShadow: '0 0 10px #ffffff',
                    // animation is handled by tailwind config or global css
                }}
            />
            <div
                className="z-[1] flex relative flex-col text-white w-full h-full border-[#202222] border rounded-[9px] items-center justify-center bg-[#0c0d0d]"
                style={{ background: 'radial-gradient(circle 280px at 0% 0%, #444444, #0c0d0d)' }}
            >
                <div
                    className="text-6xl font-bold tracking-tight bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, rgb(0, 0, 0) 4%, rgb(255, 255, 255), rgb(0, 0, 0))',
                    }}
                >
                    {value}
                </div>
                <div className="text-white mt-2 font-manrope font-medium">{label}</div>

                {/* Grid Lines */}
                <div
                    className="absolute w-full h-[1px]"
                    style={{ top: '10%', background: 'linear-gradient(90deg, #888888 30%, #1d1f1f 70%)' }}
                />
                <div
                    className="absolute w-[1px] h-full"
                    style={{ left: '10%', background: 'linear-gradient(180deg, #747474 30%, #222424 70%)' }}
                />
                <div className="absolute w-full h-[1px] bg-[#2c2c2c]" style={{ bottom: '10%' }} />
                <div className="absolute w-[1px] h-full bg-[#2c2c2c]" style={{ right: '10%' }} />
            </div>
        </div>
    );
};

export default AnimatedStatsCard;
