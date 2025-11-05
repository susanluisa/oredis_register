import Image from 'next/image';
import React from 'react';

export const OredisLogo = () => {
  return (
    <div className="flex flex-row justify-center items-center">
      <Image src="/logo_oredis.png" width={80} height={20} alt="Logo Oredis" />
      <div className="flex text-[24px] font-extrabold font-sans">
        <span className="text-blue-500 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">O</span>
        <span className="text-red-600 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">R</span>
        <span className="text-yellow-400 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">E</span>
        <span className="text-gray-500 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">D</span>
        <span className="text-green-500 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">I</span>
        <span className="text-blue-800 [text-shadow:0_0_1px_black] [-webkit-text-stroke:0.5px_black]">S</span>
      </div>
    </div>
  );
};


export const OredisSimpleLogo = () => {
  return (
    <div className="flex flex-row justify-center items-center">
      <Image src="/logo_oredis.png" width={80} height={20} alt="Logo Oredis" />
    </div>
  );
};


