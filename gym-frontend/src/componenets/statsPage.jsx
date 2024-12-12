import React, { useState, useEffect } from "react";
import { User, Clock, Flame, Trophy } from "lucide-react";
import ApexCharts from "react-apexcharts";
import axiosInstance from "./utils/axiosInstance";
import loader from "./Main Scene.json";
import { Player } from "@lottiefiles/react-lottie-player";

// Helper function to convert seconds to hours, minutes, seconds
const convertSecondsToHMS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.length > 0 ? parts.join(" ") : "0s";
};

const WorkoutStatsPage = () => {
  const [stats, setStats] = useState({
    total_exercises: 0,
    total_completed_exercises: 0,
    total_workout_time: 0,
    total_calories_burned: 0,
    overall_progress_percentage: 0,
  });

  const [chartData, setChartData] = useState({
    exerciseDetails: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const workoutProgressResponse = await axiosInstance.get(
          "/workout-progress/"
        );
        setStats(workoutProgressResponse.data);
        setChartData({
          exerciseDetails: workoutProgressResponse.data.exercise_details || [],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching workout stats:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to safely get chart data
  const getChartSeries = (accessor) => {
    return chartData.exerciseDetails.length > 0
      ? chartData.exerciseDetails.map(accessor)
      : [];
  };

  // 1. Radial Bar Chart for Progress Percentage
  const progressPercentageChartOptions = {
    series: getChartSeries((detail) => detail.progress_percentage || 0),
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
            formatter: function (val) {
              return val.toFixed(0) + "%";
            },
          },
          total: {
            show: true,
            label: "Progress",
            formatter: function (w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              return w.globals.series.length > 0
                ? (total / w.globals.series.length).toFixed(0) + "%"
                : "0%";
            },
          },
        },
      },
    },
    labels: getChartSeries((detail) => detail.name || "Unknown"),
    title: {
      text: "Exercise Progress Percentage",
      align: "center",
    },
  };

  // 2. Stacked Column Chart with Flexible Tracking
  const caloriesWorkoutTimeChartOptions = {
    series: [
      {
        name: "Calories Burned",
        data: getChartSeries((detail) =>
          Math.round(detail.calories_burned || 0)
        ),
      },
      {
        name: "Tracking Metric",
        data: getChartSeries((detail) => {
          // Prioritize sets if available, otherwise use duration
          if (
            detail.sets_completed !== undefined &&
            detail.sets_completed !== null
          ) {
            return detail.sets_completed;
          }
          return detail.total_workout_time || 0;
        }),
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: getChartSeries((detail) => detail.name || "Unknown"),
    },
    yaxis: [
      {
        title: {
          text: "Calories Burned",
        },
      },
      {
        opposite: true,
        title: {
          text: "Tracking Metric",
        },
        labels: {
          formatter: function (val) {
            // Dynamically show different labels based on the metric
            const firstDetail = chartData.exerciseDetails[0];
            if (
              firstDetail.sets_completed !== undefined &&
              firstDetail.sets_completed !== null
            ) {
              return val.toFixed(0) + " sets";
            }
            return val.toFixed(0) + " sec";
          },
        },
      },
    ],
    title: {
      text: "Exercise Performance Breakdown",
      align: "left",
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex }) {
          const detail = chartData.exerciseDetails[dataPointIndex];
          if (seriesIndex === 0) {
            return val.toFixed(0) + " calories";
          } else {
            // Dynamically format tooltip based on available metric
            if (
              detail.sets_completed !== undefined &&
              detail.sets_completed !== null
            ) {
              return val.toFixed(0) + " sets";
            }
            return val.toFixed(0) + " sec";
          }
        },
      },
    },
  };

  // 3. Pie Chart for Calories Distribution
  const caloriesDistributionChartOptions = {
    series: getChartSeries((detail) => Math.round(detail.calories_burned || 0)),
    chart: {
      width: "100%",
      type: "pie",
    },
    labels: getChartSeries((detail) => detail.name || "Unknown"),
    title: {
      text: "Calories Burned Distribution",
      align: "center",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-xl text-red-600">
          Error loading workout statistics. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 custom-bg min-h-screen font-sour-gummy">
      <h1 className="text-3xl font-bold mb-6 text-white">Workout Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview Stats */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center bg-blue-100 p-4 rounded-lg">
              <User className="text-blue-600 mr-4" size={40} />
              <div>
                <p className="text-sm text-gray-600">Total Exercises</p>
                <p className="text-2xl font-bold">{stats.total_exercises}</p>
              </div>
            </div>
            <div className="flex items-center bg-green-100 p-4 rounded-lg">
              <Flame className="text-green-600 mr-4" size={40} />
              <div>
                <p className="text-sm text-gray-600">Total Calories Burned</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.total_calories_burned)}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-purple-100 p-4 rounded-lg">
              <Clock className="text-purple-600 mr-4" size={40} />
              <div>
                <p className="text-sm text-gray-600">Total Workout Time</p>
                <p className="text-2xl font-bold">
                  {convertSecondsToHMS(stats.total_workout_time)}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-red-100 p-4 rounded-lg">
              <Trophy className="text-red-600 mr-4" size={40} />
              <div>
                <p className="text-sm text-gray-600">Completed Exercises</p>
                <p className="text-2xl font-bold">
                  {stats.total_completed_exercises}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Charts */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            {chartData.exerciseDetails.length > 0 ? (
              <>
                <ApexCharts
                  options={progressPercentageChartOptions}
                  series={progressPercentageChartOptions.series}
                  type="radialBar"
                  height={350}
                />
                <ApexCharts
                  options={caloriesWorkoutTimeChartOptions}
                  series={caloriesWorkoutTimeChartOptions.series}
                  type="bar"
                  height={350}
                />
                <ApexCharts
                  options={caloriesDistributionChartOptions}
                  series={caloriesDistributionChartOptions.series}
                  type="pie"
                  width={500}
                />
              </>
            ) : (
              <div className="text-center text-gray-600">
                No exercise details available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStatsPage;
