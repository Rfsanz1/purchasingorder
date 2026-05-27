import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  return (
    <div className='bg-white py-5 px-5 rounded-lg w-[50%]'>
        <div className='flex items-start justify-between'>
            <h1 className='text-[#1E1B4B] text-lg font-semibold tracking-wide'>{title}</h1>
            <button className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#5B52D1]"} p-3 rounded-lg text-[#1E1B4B] text-2xl`}>{icon}</button>
        </div>
        <div>
            <h1 className='text-[#1E1B4B] text-4xl font-bold mt-5'>{
              title === "Total Earnings" ? `₹${number}` : number}</h1>
            <h1 className='text-[#1E1B4B] text-lg mt-2'><span className='text-[#5B52D1]'>{footerNum}%</span> than yesterday</h1>
        </div>
    </div>
  )
}

export default MiniCard