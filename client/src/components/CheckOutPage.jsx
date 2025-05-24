import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobleContext } from "../provider/GlobleProvider";
import { clearCart } from "../Store/CartProduct";
import AxiosTostError from "../utils/AxiosTosterror";

const CheckOutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const user = useSelector((state) => state.user);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalPrice, totalQty } = useGlobleContext();
  const cartItems = useSelector((s) => s.cartItem.cart);

  const getDeliveryCharges = () => {
    if (totalPrice < 200) return 50;
    if (totalPrice >= 200 && totalPrice <= 500) return 30;
    return 0;
  };

  const deliveryCharges = getDeliveryCharges();
  const grandTotal = totalPrice + deliveryCharges;

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await Axios(SummaryApi.getUserAddresses);
        if (res.data.success) setAddresses(res.data.data);
      } catch {
        toast.error("Failed to fetch addresses");
      }
    };
    fetchAddresses();
  }, []);

  // Add a new address
  const handleAddAddress = async () => {
    const { address_line, city, state, pincode, mobile } = form;
    if (!address_line || !city || !state || !pincode || !mobile) {
      return toast.error("Please fill all fields");
    }
    try {
      const res = await Axios({
        ...SummaryApi.addUserAddress,
        data: form,
      });
      if (res.data.success) {
        toast.success("Address added");
        setForm({
          address_line: "",
          city: "",
          state: "",
          pincode: "",
          mobile: "",
        });
        setIsAdding(false);
        // Re-fetch
        const r2 = await Axios(SummaryApi.getUserAddresses);
        if (r2.data.success) setAddresses(r2.data.data);
      }
    } catch {
      toast.error("Failed to add address");
    }
  };

  // Cash on Delivery
  const handleCOD = async () => {
    if (!selectedAddress) return toast.error("Select an address");
    try {
      const res = await Axios({
        ...SummaryApi.CashOnDelivery,
        data: {
          list_items: cartItems,
          addressId: selectedAddress,
          totalAmount: grandTotal,
          subTotalAmt: grandTotal,
          userId: user?._id,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(clearCart());
        navigate("/order-confirmation");
      } else {
        toast.error(res.data.message || "COD failed");
      }
    } catch (err) {
      AxiosTostError(err);
    }
  };

  const handleStripe = async () => {
    if (!selectedAddress) return toast.error("Please select an address");
    if (!user?._id) return toast.error("User not authenticated");

    try {
      const res = await Axios({
        ...SummaryApi.CreateOrder,
        data: {
          list_items: cartItems,
          addressId: selectedAddress,
          totalAmount: grandTotal,
          subTotalAmt: grandTotal,
          userId: user?._id,
        },
      });

      const { razorpayOrder: order } = res.data;
      const options = {
        key: "rzp_test_rv1bH6Okprpr7t",
        amount: order.amount,
        currency: order.currency,
        name: user?.name || "Customer",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await Axios({
              ...SummaryApi.VerifyPayment,
              data: {
                ...response,
                userId: user?._id,
              },
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful");
              dispatch(clearCart());
              navigate("/order-confirmation");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            AxiosTostError(error);
          }
        },
        prefill: {
          name: user?.name || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: user?.mobile || "888888888",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      AxiosTostError(err);
    }
  };

  return (
    <div className="p-4 lg:flex gap-4 bg-blue-50 min-h-screen">
      {/* LEFT: Addresses */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Choose Your Address
        </h2>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`flex items-start gap-3 p-4 rounded-lg border shadow-sm cursor-pointer transition duration-200 ${
                selectedAddress === addr._id
                  ? "border-blue-500 bg-blue-50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="address"
                className="mt-1 accent-blue-600"
                checked={selectedAddress === addr._id}
                onChange={() => setSelectedAddress(addr._id)}
              />
              <div className="text-sm text-gray-700">
                <p className="font-medium">{addr.address_line}</p>
                <p>
                  {addr.city}, {addr.state}
                </p>
                <p className="text-gray-500">India – {addr.pincode}</p>
                <p className="text-gray-500">📞 {addr.mobile}</p>
              </div>
            </label>
          ))}
        </div>

        <Link
          to="/dashboard/address"
          className="mt-6 inline-block w-full text-center py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          + Add New Address
        </Link>
      </div>

      {/* RIGHT: Summary & Payments */}
      <div className="w-full lg:w-1/3 p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="space-y-1 text-sm mb-4">
          <div className="flex justify-between">
            <span>Items total</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity total</span>
            <span>{totalQty} items</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <p className="text-sm text-gray-600">
              {deliveryCharges === 0 && "Free"}
              {deliveryCharges === 50 && "₹50"}
              {deliveryCharges === 30 && (
                <span>
                  <span className="line-through mr-1 text-gray-400">₹50</span>
                  <span className="text-green-600 font-medium">₹30</span>
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Grand total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        <button
          onClick={handleStripe}
          className="w-full bg-indigo-600 text-white py-2 rounded mb-2"
        >
          Pay with Card
        </button>

        <button
          onClick={handleCOD}
          className="w-full border border-green-600 text-green-600 py-2 rounded"
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  );
};

export default CheckOutPage;
