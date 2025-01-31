import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

function Dashboard() {
  const [discountRequests, setDiscountRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const rowsPerPage = 7; 

  useEffect(() => {
    const users = localStorage.getItem("user");
    const user = JSON.parse(users);

    if (user?.id) {
      setUserId(user.id);
    } else {
      console.error("User ID not found in localStorage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchDiscountRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/deals/discountRequests?userId=${userId}`
        );

        if (response.data && response.data.discountRequests) {
          setDiscountRequests(response.data.discountRequests);
        }
      } catch (error) {
        console.error("Error fetching discount requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountRequests();
  }, [userId]);

  const handleAction = async (id, shopOwnerId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/deals/approvedDiscount/${id}`,
        { shopOwnerId }
      );

      if (response.status === 200) {
        console.log("Deal approved successfully");

        const fetchDiscountRequests = async () => {
          try {
            const response = await axios.get(
              `${BASE_URL}/api/deals/discountRequests?userId=${userId}`
            );
            if (response.data && response.data.discountRequests) {
              setDiscountRequests(response.data.discountRequests);
            }
          } catch (error) {
            console.error("Error refetching discount requests:", error);
          }
        };
        fetchDiscountRequests();
      } else {
        console.error("Error approving deal:", response.data);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const totalPages = Math.ceil(discountRequests.length / rowsPerPage);
  const displayedRequests = discountRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen pt-28 bg-rose-700">
      <h2 className="text-4xl font-bold text-white text-center mb-10 uppercase">
        Discount Requests Dashboard
      </h2>

      <div className="shadow-md rounded-lg mx-auto w-10/12 overflow-hidden">
        <table className="min-w-full bg-white table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Deal Name</th>
              <th className="px-4 py-2 border-b">Customer Name</th>
              <th className="px-4 py-2 border-b">Phone Number</th>
              <th className="px-4 py-2 border-b">Is Verified</th>
              <th className="px-4 py-2 border-b">Is Approved</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedRequests.map((request) => (
              <tr
                key={request.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-black font-semibold hover:translate-x-2 transform transition-transform duration-300 hover:bg-gray-200"
              >
                <td className="px-4 py-2 border-b">{request.Deal.dealName}</td>
                <td className="px-4 py-2 border-b">{request.User.name}</td>
                <td className="px-4 py-2 border-b">{request.User.phoneNumber}</td>
                <td className="px-4 py-2 border-b">
                  {request.User.isVerified ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border-b">
                  {request.isApproved ? "Approved" : "Pending"}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleAction(request.id, request.Deal.userId)}
                    className="bg-rose-800 text-white px-4 py-2 rounded hover:bg-red-700 hover:translate-x-2 transform transition-all duration-300"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
  <div className="flex justify-center gap-x-5 items-center p-4 bg-gray-100">
    <button
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded ${
        currentPage === 1 ? "bg-gray-300" : "bg-rose-800 text-white"
      }`}
    >
      Previous
    </button>
    <span className="text-black">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded ${
        currentPage === totalPages ? "bg-gray-300" : "bg-rose-800 text-white"
      }`}
    >
      Next
    </button>
  </div>
)}

      </div>
    </div>
  );
}

export default Dashboard;
