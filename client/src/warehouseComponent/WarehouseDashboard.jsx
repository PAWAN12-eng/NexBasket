import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import Warehouse from "./WarehouseSideBar";
import logo from "../../public/logo.png";
import logoicon from "../../public/logoicon.png";
import { FaUserCircle } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const WarehouseDashboard = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      try {
        const res = await Axios(SummaryApi.getWarehouseDetails(id));
        if (res.data.success) {
          setWarehouse(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch warehouse details");
      }
    };

    fetchWarehouseDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img
              src={logoicon}
              alt="logo icon"
              className="w-12 sm:w-12 md:w-12 lg:w-12  h-auto"
            />
            <img
              src={logo}
              alt="logo text"
              className="w-28 sm:w-32 md:w-40 lg:w-44 ml-[-1px] h-auto"
            />
          </Link>
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {warehouse ? warehouse.name : "Loading..."}
            </h1>
            <p className="text-sm text-gray-500">
              {warehouse ? warehouse.location : "Fetching address..."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/warehouse-List"
            className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-all duration-200 hover:shadow-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Warehouse List</span>
          </Link>
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-2xl text-gray-600 hover:text-black cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-white shadow-md border-r min-h-[calc(100vh-64px)]">
          <Warehouse />
        </aside>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Toaster position="top-center" />
          <Outlet context={{ warehouseId: id }} />
        </main>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
