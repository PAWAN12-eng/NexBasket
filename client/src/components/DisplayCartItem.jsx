import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useGlobleContext } from "../provider/GlobleProvider";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { Link } from "react-router-dom";
import PriceWithDiscount from "../utils/PriceWithDiscount";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { notDiscountPrice, totalPrice, totalDiscount, totalQty } =
    useGlobleContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  // console.log('user',user);
  const navigate = useNavigate();

  const redirectToCheckOutPage = () => {
    if (user._id) {
      navigate("/CheckOutPage");
      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };
  // Disable body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getDeliveryCharges = () => {
    if (totalPrice < 200) return 50;
    if (totalPrice >= 200 && totalPrice <= 500) return 30;
    return 0;
  };

  const deliveryCharges = getDeliveryCharges();
  const grandTotal = totalPrice + deliveryCharges;

  return (
    <section className="bg-neutral-900 fixed inset-0 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-sm h-full ml-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 shadow-md">
          <h2 className="font-semibold text-lg">Cart</h2>

          {/* Close Button */}
          <button onClick={() => navigate("/")} className="lg:hidden">
            <IoClose size={20} />
          </button>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100vh-160px)] bg-blue-50 px-4 py-2">
          {/* Savings Section */}
          <div className="text-sm pb-2">
            <div className="flex justify-between bg-blue-200 px-3 py-2 rounded-2xl">
              <p className="font-semibold text-blue-500">Your total savings</p>
              <p className="font-semibold text-blue-500">₹{totalDiscount}</p>
            </div>
          </div>

          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto bg-white rounded-lg p-2 space-y-2">
            {cartItem.length > 0 ? (
              cartItem.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center p-2 border rounded-lg shadow-sm"
                >
                  <div className="lg:min-w-16 lg:h-16 bg-red-500 rounded-md">
                    
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="lg:w-16 lg:h-16 w-12 h-12 object-cover rounded-md bg-gray-100"
                    />
                  </div>
                  {/* Item Details */}
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium text-xs text-ellipsis line-clamp-2">
                        {item.productId.name}
                      </p>
                      <p className="font-medium text-xs text-neutral-400">
                        {item.productId.unit}
                      </p>
                      <p className="font-medium text-xs">
                        ₹
                        {PriceWithDiscount(
                          item?.productId?.price,
                          item?.productId?.discount
                        )}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 font-bold">
                      <AddToCartButton data={item?.productId} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty Cart Message
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/007/902/676/non_2x/man-with-empty-shopping-cart-business-character-illustration-on-white-background-vector.jpg"
                  alt="Your cart is empty"
                  className="w-40 h-40 object-cover rounded-md bg-gray-100"
                />
                <Link
                  to="/"
                  className="bg-green-600 mt-5 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Shop now
                </Link>
              </div>
            )}
          </div>
          {/* Bill Details Section */}

          <div className="mt-2 bg-white p-2 rounded-lg shadow-sm">
            <h3 className="lg:text-lg text-sm font-semibold mb-1">
              Bill Details
            </h3>
            <div className="lg:space-y-1.5">
              <div className="flex justify-between">
                <p className="font-medium lg:text-sm text-xs">item total</p>
                <div className="flex gap-2">
                  <p className="text-gray-600 text-sm line-through">
                    ₹{notDiscountPrice}
                  </p>
                  <p className="text-sm font-medium ">₹{totalPrice}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium lg:text-sm text-xs">Total Quantity</p>
                <p className="text-sm text-gray-600">{totalQty}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium lg:text-sm text-xs">
                  Delivery Charges
                </p>
                <p className="text-sm text-gray-600">
                  {deliveryCharges === 0 && "Free"}
                  {deliveryCharges === 50 && "₹50"}
                  {deliveryCharges === 30 && (
                    <span>
                      <span className="line-through mr-1 text-gray-400">
                        ₹50
                      </span>
                      <span className="text-green-600 font-medium">₹30</span>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium lg:text-sm text-xs">Grand Total</p>
                <p className="text-sm font-medium ">₹{grandTotal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Total Price and Proceed Button */}
        <div className="p-3">
          <div className="flex justify-between items-center bg-green-700 py-3 px-2 text-white rounded-lg">
            <p className="font-semibold">Total: ₹{grandTotal}</p>
            <button
              onClick={redirectToCheckOutPage}
              className="flex items-center gap-1"
            >
              Proceed <FaAngleRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisplayCartItem;
