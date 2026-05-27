import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(scrolLRef.current){
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  },[cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  }

  return (
    <div className="px-4 py-2">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>
      <div className="mt-4 overflow-y-scroll scrollbar-hide h-[380px]" ref={scrolLRef} >
        {cartData.length === 0 ? (
          <p className="text-[#6B7280] text-sm flex justify-center items-center h-[380px]">Your cart is empty. Start adding items!</p>
        ) : cartData.map((item) => {
          return (
            <div className="bg-[#F5F3FF] rounded-lg px-4 py-4 mb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-[#6B7280] font-semibold tracling-wide text-md">
                  {item.name}
                </h1>
                <p className="text-[#6B7280] font-semibold">x{item.quantity}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => handleRemove(item.id)}
                    className="text-[#6B7280] cursor-pointer"
                    size={20}
                  />
                  <FaNotesMedical
                    className="text-[#6B7280] cursor-pointer"
                    size={20}
                  />
                </div>
                <p className="text-[#1E1B4B] text-md font-bold">₹{item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartInfo;
