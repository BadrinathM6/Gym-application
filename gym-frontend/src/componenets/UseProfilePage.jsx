import React, { useState, useEffect } from "react";
import "../css/UserProfilePage.css";
import { FaPen, FaDumbbell, FaBell } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";
import usericonImg from "../assets/user-icon.jpg";
import callenderimg from "../assets/callender.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from "./utils/axiosInstance";
import SuccessAlert from "../constants/successAlert";
import logo from "../assets/logo.png";
import FooterNav from "./FooterNav";
import loader from "./Main Scene.json";

const ProfilePage = () => {
  const navigate = useNavigate();

  // State for user details
  const [userDetails, setUserDetails] = useState({
    user_id: "",
    gender: "",
    age: null,
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState({
    diet_type: "",
  });

  // State for body type
  const [bodyTypeProfile, setBodyTypeProfile] = useState({
    body_type: "",
  });

  // State for physical profile
  const [physicalProfile, setPhysicalProfile] = useState({
    height: null,
    weight: null,
  });

  // State for edit profile section
  const [isEditProfileExpanded, setIsEditProfileExpanded] = useState(false);

  // Temporary state for unsaved changes
  const [tempUserDetails, setTempUserDetails] = useState({
    gender: "",
    age: null,
  });
  const [tempDietaryPreferences, setTempDietaryPreferences] = useState({
    diet_type: "",
  });
  const [tempBodyTypeProfile, setTempBodyTypeProfile] = useState({
    body_type: "",
  });
  const [tempPhysicalProfile, setTempPhysicalProfile] = useState({
    height: null,
    weight: null,
  });

  // Dropdown options
  const GENDER_OPTIONS = [
    { value: "", label: "Select Gender" },
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" },
    { value: "N", label: "Prefer not to say" },
  ];

  const DIET_TYPE_OPTIONS = [
    { value: "", label: "Select Diet Type" },
    { value: "VEG", label: "Vegetarian" },
    { value: "NON_VEG", label: "Non-Vegetarian" },
    { value: "VEGAN", label: "Vegan" },
  ];

  const BODY_TYPE_OPTIONS = [
    { value: "", label: "Select Body Type" },
    { value: "SKINNY", label: "Skinny - Need to gain muscle mass" },
    { value: "FLABBY", label: "Flabby - Need to lose fat and tone up" },
    { value: "IDEAL", label: "Ideal - Maintain current physique" },
  ];

  // Fetch functions
  useEffect(() => {
    fetchUserDetails();
    fetchDietaryPreferences();
    fetchBodyTypeProfile();
    fetchPhysicalProfile();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("user/");
      setUserDetails(response.data);
      // Initialize temp state with current values
      setTempUserDetails({
        gender: response.data.gender,
        age: response.data.age,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietaryPreferences = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("update-dietary-preferences/");
      setDietaryPreferences(response.data);
      // Initialize temp state with current values
      setTempDietaryPreferences({
        diet_type: response.data.diet_type,
      });
    } catch (error) {
      console.error("Error fetching dietary preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBodyTypeProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("update-body-type/");
      setBodyTypeProfile(response.data);
      // Initialize temp state with current values
      setTempBodyTypeProfile({
        body_type: response.data.body_type,
      });
    } catch (error) {
      console.error("Error fetching body type profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhysicalProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("update-physical-profile/");
      setPhysicalProfile(response.data);
      // Initialize temp state with current values
      setTempPhysicalProfile({
        height: response.data.height,
        weight: response.data.weight,
      });
    } catch (error) {
      console.error("Error fetching physical profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update save function
  const saveAllChanges = async () => {
    try {
      await axiosInstance.put("user/", {
        gender: tempUserDetails.gender,
        age: tempUserDetails.age,
      });

      // Update dietary preferences
      await axiosInstance.put("update-dietary-preferences/", {
        diet_type: tempDietaryPreferences.diet_type,
      });

      // Update body type
      await axiosInstance.put("update-body-type/", {
        body_type: tempBodyTypeProfile.body_type,
      });

      // Update physical profile
      await axiosInstance.put("update-physical-profile/", {
        height: tempPhysicalProfile.height,
        weight: tempPhysicalProfile.weight,
      });

      // Refresh all data after updates
      fetchUserDetails();
      fetchDietaryPreferences();
      fetchBodyTypeProfile();
      fetchPhysicalProfile();

      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Render dropdown field
  const renderDropdownField = (label, value, options, onChangeFn) => {
    return (
      <div className="editable-field">
        <div className="field-label">
          <span>{label}</span>
          <span>{value || "Not set"}</span>
        </div>
        <select
          className="edit-input"
          value={value}
          onChange={(e) => onChangeFn(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render numeric input field
  const renderNumericField = (label, value, onChangeFn) => {
    return (
      <div className="editable-field">
        <div className="field-label">
          <span>{label}</span>
          <span>{value || "Not set"}</span>
        </div>
        <input
          type="number"
          placeholder={`Enter new ${label.toLowerCase()}`}
          className="edit-input"
          value={value || ""}
          onChange={(e) => onChangeFn(e.target.value)}
        />
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
      ) : (
        <div className="profile-page">
          {/* Header Section */}
          <header className="profile-header">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">BUFFALO GYM</h1>
          </header>

          {/* Profile Info Section */}
          <div className="profile-info">
            <img src={usericonImg} alt="User" className="profile-picture" />
            <h2 className="user-name"> User id : {userDetails.user_id}</h2>
          </div>

          <div className="button-container">
            <button className="stats-button" onClick={() => navigate("/stat")}>
              Stats
            </button>
          </div>

          {/* My Journey Section */}
          <div className="my-journey">
            <h3>My Journey</h3>
            <div className="journey-stats">
              <div className="stat-box">
                <p>0</p>
                <p>Calories</p>
              </div>
              <div className="stat-box">
                <p>0</p>
                <p>Workout</p>
              </div>
              <div className="stat-box">
                <p>0</p>
                <p>Minutes</p>
              </div>
            </div>
            <div className="calendar-box">
              <img src={callenderimg} alt="Calendar" />
              <p>Calendar</p>
              <span className="arrow">→</span>
            </div>
          </div>

          {/* Settings Section */}
          <div className="settings">
            <h3>Settings</h3>
            <div className="settings-options">
              <div
                className="option"
                onClick={() => setIsEditProfileExpanded(!isEditProfileExpanded)}
              >
                <FaPen />
                <p>Edit Profile</p>
              </div>
              {isEditProfileExpanded && (
                <div className="edit-profile-container">
                  <div className="edit-profile-details">
                    {renderDropdownField(
                      "Gender",
                      tempUserDetails.gender || userDetails.gender,
                      GENDER_OPTIONS,
                      (value) =>
                        setTempUserDetails({
                          ...tempUserDetails,
                          gender: value,
                        })
                    )}
                  </div>
                  <div className="edit-profile-details">
                    {renderNumericField(
                      "Age",
                      tempUserDetails.age || userDetails.age,
                      (value) =>
                        setTempUserDetails({ ...tempUserDetails, age: value })
                    )}
                  </div>
                  <div className="edit-profile-details">
                    {renderDropdownField(
                      "Diet Type",
                      tempDietaryPreferences.diet_type ||
                        dietaryPreferences.diet_type,
                      DIET_TYPE_OPTIONS,
                      (value) =>
                        setTempDietaryPreferences({
                          ...tempDietaryPreferences,
                          diet_type: value,
                        })
                    )}
                  </div>
                  <div className="edit-profile-details">
                    {renderDropdownField(
                      "Body Type",
                      tempBodyTypeProfile.body_type ||
                        bodyTypeProfile.body_type,
                      BODY_TYPE_OPTIONS,
                      (value) =>
                        setTempBodyTypeProfile({
                          ...tempBodyTypeProfile,
                          body_type: value,
                        })
                    )}
                  </div>
                  <div className="edit-profile-details">
                    {renderNumericField(
                      "Height (cm)",
                      tempPhysicalProfile.height || physicalProfile.height,
                      (value) =>
                        setTempPhysicalProfile({
                          ...tempPhysicalProfile,
                          height: value,
                        })
                    )}
                  </div>
                  <div className="edit-profile-details">
                    {renderNumericField(
                      "Weight (kg)",
                      tempPhysicalProfile.weight || physicalProfile.weight,
                      (value) =>
                        setTempPhysicalProfile({
                          ...tempPhysicalProfile,
                          weight: value,
                        })
                    )}
                  </div>

                  <div className="save-changes-container">
                    <button
                      className="save-changes-button"
                      onClick={saveAllChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              <div className="option">
                <FaDumbbell />
                <p>Fitness Plan</p>
              </div>
              <div className="option">
                <FaBell />
                <p>Reminders</p>
              </div>
            </div>
          </div>

          {showSuccessAlert && (
            <SuccessAlert
              message="Profile Updated Successfully!"
              onClose={() => setShowSuccessAlert(false)}
            />
          )}

          <div className="foot">
            <FooterNav />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
