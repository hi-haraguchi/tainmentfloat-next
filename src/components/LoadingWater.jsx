'use client'

export default function LoadingWater() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                {/* 下半分に波を表示 */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
                    {/* 波1 */}
                    <div className="absolute inset-0">
                        <svg
                            className="absolute bottom-0 w-[200%] h-full animate-wave1"
                            viewBox="0 0 1200 200"
                            preserveAspectRatio="none">
                            {/* 振幅を大きくした波 */}
                            <path
                                d="M0,100 C150,250 350,-50 600,100 C850,250 1050,-50 1200,100 V200 H0 Z"
                                fill="rgba(0,150,136,0.3)"
                            />
                            <path
                                d="M1200,100 C1350,250 1550,-50 1800,100 C2050,250 2250,-50 2400,100 V200 H1200 Z"
                                fill="rgba(0,150,136,0.3)"
                            />
                        </svg>
                    </div>
                    {/* 波2 */}
                    <div className="absolute inset-0">
                        <svg
                            className="absolute bottom-0 w-[200%] h-full animate-wave2"
                            viewBox="0 0 1200 200"
                            preserveAspectRatio="none">
                            <path
                                d="M0,100 C150,-50 350,250 600,100 C850,-50 1050,250 1200,100 V200 H0 Z"
                                fill="rgba(0,150,136,0.4)"
                            />
                            <path
                                d="M1200,100 C1350,-50 1550,250 1800,100 C2050,-50 2250,250 2400,100 V200 H1200 Z"
                                fill="rgba(0,150,136,0.4)"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes wave {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-wave1 {
                    animation: wave 6s linear infinite;
                }
                .animate-wave2 {
                    animation: wave 6s linear infinite;
                    animation-delay: -1.6s; /* 👈 少し遅らせる */
                }
            `}</style>
        </div>
    )
}
