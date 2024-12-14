import React, { Suspense, lazy, useEffect} from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import loader from "./componenets/Main Scene.json";
// Lazy load components
const LoginPage = lazy(() => import("./componenets/LoginPage"));
const Dashboard = lazy(() => import("./componenets/Dashboard"));
const GenderSelectionPage = lazy(() => import("./componenets/GenderSelection"));
const VegAndNonVegPage = lazy(() => import("./componenets/foodTypeSelection"));
const BodyTypeSelectionPage = lazy(() =>
  import("./componenets/bodyTypeSelectionPage")
);
const BMIPage = lazy(() => import("./componenets/BMICalculatorPage"));
const AgePage = lazy(() => import("./componenets/AgePage"));
const ChatPage = lazy(() => import("./componenets/chatPage"));
const WorkoutPage = lazy(() => import("./componenets/WorkoutPage"));
const ProfilePage = lazy(() => import("./componenets/UseProfilePage"));
const WorkoutChallenge = lazy(() => import("./componenets/workoutDayPage"));
const DayWorkoutPage = lazy(() => import("./componenets/WorkoutListPage"));
const ExercisePage = lazy(() => import("./componenets/WorkoutDetailPage"));
const FoodPage = lazy(() => import("./componenets/FoodCategorySelectionPage"));
const TodayPlanPage = lazy(() => import("./componenets/foodSelectionPage"));
const WorkoutStatsPage = lazy(() => import("./componenets/statsPage"));

// Improved Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login", {
          state: {
            from: location,
            sessionExpired: true,
          },
          replace: true,
        });
      }
    };

    checkAuth();
  }, [location, navigate]);

  return children;
};

const AuthenticatedRoute = ({ element: Component, ...rest }) => {
  return (
    <ProtectedRoute>
      <Component {...rest} />
    </ProtectedRoute>
  );
};

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulating initial app loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingFallback = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:"#252b2d"
      }}
    >
      <Player autoplay loop src={loader} style={{ width: 300, height: 300 }} />
    </div>
  );

  if (isLoading) return <LoadingFallback />;

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<AuthenticatedRoute element={Dashboard} />}
          />
          <Route
            path="/genderselection"
            element={<AuthenticatedRoute element={GenderSelectionPage} />}
          />
          <Route
            path="/foodtypeselection"
            element={<AuthenticatedRoute element={VegAndNonVegPage} />}
          />
          <Route
            path="/bodytypeselection"
            element={<AuthenticatedRoute element={BodyTypeSelectionPage} />}
          />
          <Route
            path="/bmi-calculator"
            element={<AuthenticatedRoute element={BMIPage} />}
          />
          <Route
            path="/age"
            element={<AuthenticatedRoute element={AgePage} />}
          />
          <Route
            path="/ai-chat"
            element={<AuthenticatedRoute element={ChatPage} />}
          />
          <Route
            path="/workout-week"
            element={<AuthenticatedRoute element={WorkoutPage} />}
          />
          <Route
            path="/user-profile"
            element={<AuthenticatedRoute element={ProfilePage} />}
          />
          <Route
            path="/workout-day/:programId"
            element={<AuthenticatedRoute element={WorkoutChallenge} />}
          />
          <Route
            path="/exercise-day/:dayId"
            element={<AuthenticatedRoute element={DayWorkoutPage} />}
          />
          <Route
            path="/exercise/:exerciseId"
            element={<AuthenticatedRoute element={ExercisePage} />}
          />
          <Route
            path="/foodpage"
            element={<AuthenticatedRoute element={FoodPage} />}
          />
          <Route
            path="/today"
            element={<AuthenticatedRoute element={TodayPlanPage} />}
          />
          <Route
            path="/stat"
            element={<AuthenticatedRoute element={WorkoutStatsPage} />}
          />
          <Route path="*" element={<navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;
