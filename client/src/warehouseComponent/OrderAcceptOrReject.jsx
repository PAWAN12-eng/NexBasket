import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import {
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaWarehouse,
} from "react-icons/fa";
import toast from "react-hot-toast";
import OrderStatusStepper from "../components/OrderStatusStepper";

const OrderAcceptOrRejectByWareHouse = () => {
  const { id } = useParams(); // warehouse id
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // Status steps for stepper
  const warehouseStatusSteps = [
    { id: "pending", label: "Pending", icon: <FaBoxOpen /> },
    { id: "accepted", label: "Accepted", icon: <FaWarehouse /> },
    { id: "shipped", label: "Shipped", icon: <FaTruck /> },
    { id: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  // Fetch orders for this warehouse
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Assuming SummaryApi.getWarehouseById returns orders for warehouse id
      const res = await Axios(SummaryApi.getWarehouseById(id));
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status API call
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await Axios.put(SummaryApi.updateOrderStatus(orderId), {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Filter orders by active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.status === "pending";
    if (activeTab === "accepted") return order.status === "accepted";
    if (activeTab === "shipped") return order.status === "shipped";
    if (activeTab === "delivered") return order.status === "delivered";
    return true;
  });

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total price helper
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = Number(item.productId?.price || 0);
      const discount = Number(item.productId?.discount || 0);
      const discountedPrice = price * (1 - discount / 100);
      return sum + discountedPrice * (item.qty || 0);
    }, 0);
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FaWarehouse className="text-blue-200" /> Warehouse Order
              Management
            </h1>
            <p className="text-blue-100 mt-1">
              Manage and update order statuses
            </p>
          </div>
        
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex border-b border-gray-200">
          {["pending", "accepted", "shipped", "delivered"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No {activeTab} orders
            </h3>
            <p className="mt-1 text-gray-500">
              There are currently no {activeTab} orders for this warehouse.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const totalPrice = calculateTotal(order.items);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Customer: {order.userId?.name || "—"} •{" "}
                          {order.userId?.email || "—"}
                        </p>
                        {order.shippingAddress && (
                          <p className="text-sm text-gray-600 mt-1">
                            Ship to: {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="p-4 border-b border-gray-200">
                    <OrderStatusStepper
                      status={order.status}
                      createdAt={order.createdAt}
                      updatedAt={order.updatedAt}
                      steps={warehouseStatusSteps}
                    />
                  </div>

                  {/* Products and Actions */}
                  <div className="p-4 flex flex-col lg:flex-row gap-6">
                    {/* Products */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Products
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-3 bg-gray-50 rounded border border-gray-100"
                          >
                            <img
                              src={
                                item.productId?.image?.[0] ||
                                "/placeholder-product.png"
                              }
                              alt={item.productId?.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-semibold">
                                {item.productId?.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.qty} × ₹{item.productId?.price || 0}
                                {item.productId?.discount > 0 && (
                                  <span className="ml-2 text-green-600 font-semibold">
                                    ({item.productId.discount}% off)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {/* Actions */}
                    <div className="w-full max-w-xs flex flex-col justify-between gap-4">
                      <h4 className="font-medium text-gray-700">Actions</h4>

                      {/* Show buttons for pending and accepted */}
                      {["pending", "accepted"].includes(order.status) && (
                        <div className="space-x-2">
                          {order.status === "pending" && (
                            <>
                              <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={() =>
                                  handleStatusChange(order._id, "accepted")
                                }
                              >
                                <FaCheck className="inline mr-2" />
                                Accept
                              </button>

                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={() =>
                                  handleStatusChange(order._id, "cancelled")
                                }
                              >
                                <FaTimes className="inline mr-2" />
                                Reject
                              </button>
                            </>
                          )}

                          {order.status === "accepted" && (
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              onClick={() =>
                                handleStatusChange(order._id, "shipped")
                              }
                            >
                              <FaTruck className="inline mr-2" />
                              Mark as Shipped
                            </button>
                          )}
                        </div>
                      )}

                      {/* When order is shipped, show "Mark as Delivered" button */}
                      {order.status === "shipped" && (
                        <button
                          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                          onClick={() =>
                            handleStatusChange(order._id, "delivered")
                          }
                        >
                          <FaCheckCircle className="inline mr-2" />
                          Mark as Delivered
                        </button>
                      )}

                      {/* When order is delivered, show status text */}
                      {order.status === "delivered" && (
                        <p className="text-green-600 font-semibold">
                          This order is Delivered.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderAcceptOrRejectByWareHouse;
