import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken');
      // console.log("token",token);
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate('/login'); // Redirect on error
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="space-y-8">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">User Details</h2>
            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Name:</span> {user.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Social Media Handle:</span>{' '}
                {user.socialMediaHandle}
              </p>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Uploaded Images:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.images.map((image, index) => (
                <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={`Uploaded by ${user.name}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
