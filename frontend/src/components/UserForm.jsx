import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [name, setName] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    // Prepare FormData for file upload
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    formData.append('name', name);
    formData.append('socialMediaHandle', socialMediaHandle);

    try {
      await axios.post('http://localhost:5000/api/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('User created successfully');
      setName('');
      setSocialMediaHandle('');
      setImages([]);
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Social Media Handle"
            value={socialMediaHandle}
            onChange={(e) => setSocialMediaHandle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded-md text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
          }`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
