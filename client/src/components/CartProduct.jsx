import React from "react";
import { IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { validURLConverter } from "../utils/valideURLConvert";
import PriceWithDiscount from "../utils/PriceWithDiscount";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTosterror";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobleContext } from "../provider/GlobleProvider";
import AddToCartButton from "./AddToCartButton";

const CartProduct = ({ data }) => {
  const url = `/product/${validURLConverter(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  // const {fetchCartItems,handleUpdateQty}=useGlobleContext()

  // const handelAddToCart = async(e)=>{
  //     e.preventDefault()
  //     e.stopPropagation()
  //     try {
  //        setLoading(true)
  //         const response = await Axios({
  //             ...SummaryApi.AddToCart,
  //             data:{
  //                 productId:data?._id
  //             }
  //         })
  //         const {data:responseData}=response
  //         if(responseData.success){
  //             toast.success(responseData.message)
  //             if(fetchCartItems){
  //                 fetchCartItems()
  //             }

  //         }
  //     } catch (error) {
  //         AxiosTostError(error)
  //     }finally{
  //         setLoading(false)
  //     }
  // }



  return (
    <Link
      to={url}
      className="relative border px-3 pb-2 grid gap-1 lg:gap-3 lg:max-w-52 max-w-40 lg:min-w-52 min-w-40 rounded-lg bg-white"
    >
         {data.discount > 0 && (
        <div className="absolute top-0 left-1 z-10 hidden lg:block">
          <span className="bg-green-500 text-white text-[11px] lg:text-xs font-bold px-2 py-0.5 rounded shadow-md tracking-wide transition-transform duration-300 ease-in-out">
            {data.discount}% OFF
          </span>
        </div>
      )}

      {data.discount > 0 && (
        <div className="absolute top-0 left-0 z-0 block lg:hidden">
          <div className="bg-green-500 text-white text-xs font-bold px-1 py-0.5 rounded-md shadow-sm">
            <div className="text-[0.65rem] leading-tight text-center">
              {data.discount}%
            </div>
            <div className="text-[0.60rem] text-center">OFF</div>
          </div>
        </div>
      )}

      <div className="relative min-h-20 max-h-20 lg:min-h-32 lg:max-h-32 overflow-hidden rounded-lg">
        {/* Discount badge */}


        {/* Product image */}
        <div className="w-fit h-full rounded-lg overflow-hidden mx-auto">
          <img
            src={data.image[0]}
            alt=""
            className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>

      <div className="px-2 p-[1px] text-green-600 text-sm rounded bg-green-100 w-fit">
        11 min
      </div>
      <div className="font-medium line-clamp-2 text-ellipsis lg:min-h-12 min-h-12">
        {data.name}
      </div>
      {/* show stock according to the warehosue */}

      <div className="w-fit">
        {data.unit}
      </div>

      <div className="flex items-center justify-between gap-2 h-10 ">
        <div className="w-fit font-semibold text-center">
          <span className="flex items-center">
            <IndianRupee size={12} className="text-black mt-0.5" />
            {PriceWithDiscount(data.price, data.discount)}
          </span>
          {data.discount > 0 && (
            <p className="line-through text-sm text-gray-600">
              {" "}
              ₹{data.price}{" "}
            </p>
          )}
        </div>

        <div>
          {data.stock == 0 ? (
            <p className="text-red-500 text-sm text-center font-semibold">
              Out of stock
            </p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CartProduct;
