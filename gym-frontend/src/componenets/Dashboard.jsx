import React, { useState, useEffect } from 'react';
import axiosInstance from './utils/axiosInstance';
import { Card } from 'antd';
import { Button } from 'antd';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axiosInstance.get('/user/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto" title="Gym Application Dashboard">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, {userData.username}!</h2>
          <p className="mb-4">Your user ID is: {userData.id}</p>
          <Button type="primary">Update Profile</Button>
        </div>
      )}
    </Card>
  );
};

export default DashboardPage;