import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./pages/kenz/Dashboard"));
const Overview = lazy(() => import("./pages/kenz/Overview"));
const Home = lazy(() => import("./pages/kenz/Home"));
const Login = lazy(() => import("./auth/Login"));
const SignUp = lazy(() => import("./auth/SignUp"));
const ForgetPassword = lazy(() => import("./auth/ForgetPassword"));
const ResetLink = lazy(() => import("./auth/ResetLink"));
const ResetPassword = lazy(() => import("./auth/welcomeback/ResetPassword"));
const Mockexam = lazy(() => import("./pages/kenz/Mockexam"));
const PastQuestion = lazy(() => import("./pages/jacob/PastQuestion"));
const Profile = lazy(() => import("./pages/kenz/Profile"));
const Subscription = lazy(() => import("./pages/jacob/Subscription"));
const AboutUs = lazy(() => import("./pages/jacob/AboutUs"));
const Verify = lazy(() => import("./auth/Verify"));
const ExamBody = lazy(() => import("./pages/kenz/ExamBody"));
const MakePayment = lazy(() => import("./pages/jacob/MakePayment"));
const ViewPastQuestion = lazy(() => import("./pages/jacob/ViewPastQuestion"));
const Callback = lazy(() => import("./components/Callback"));
const VerifyPayment = lazy(() => import("./pages/kenz/VerifyPayment"));
const MockResult = lazy(() => import("./pages/kenz/MockResult"));
const Facebookredirect = lazy(() => import("./auth/Facebookredirect"));
const ErrorPgae = lazy(() => import("./pages/jacob/ErrorPgae"));
const ResultPage = lazy(() => import("./pages/jacob/ResultPage"));
const Plans = lazy(() => import("./pages/jacob/Plans"));

// These MUST be eager imports (needed for the layout/routing to work)
import MainHolder from "./routes/MainHolder";
import PrivateRoute from "./routes/PrivateRoute";
import AppWrapper from "./components/AppWrapper";
import InvisibleFallback from "./components/InvisibleFallback";
import { prefetchCommonRoutes } from "./utils/routePrefetch";
import Loading from "./components/Loading";

// Prefetch common routes on app load
prefetchCommonRoutes();

const routes = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      { path: "*", element: <ErrorPgae /> },
      {
        path: "",
        element: <MainHolder />,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "about-us",
            element: (
              <Suspense fallback={<InvisibleFallback />}>
                <AboutUs />
              </Suspense>
            ),
          },
          {
            path: "plans",
            element: (
              <Suspense fallback={<InvisibleFallback />}>
                <Plans />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/forgetpassword",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <ForgetPassword />
          </Suspense>
        ),
      },
      {
        path: "/resetlink",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <ResetLink />
          </Suspense>
        ),
      },
      {
        path: "/reset-password/:token",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/verify/:token",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <Verify />
          </Suspense>
        ),
      },
      {
        path: "/callback/:token/:userId",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <Callback />
          </Suspense>
        ),
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "verifyingPayment",
            element: (
              <Suspense fallback={<InvisibleFallback />}>
                <VerifyPayment />
              </Suspense>
            ),
          },
          {
            element: <Dashboard />,
            children: [
              {
                path: "/overview",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Overview />
                  </Suspense>
                ),
                index: true,
              },
              {
                path: "/mock-exam",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <Mockexam />
                  </Suspense>
                ),
              },
              {
                path: "/past-questions",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <PastQuestion />
                  </Suspense>
                ),
              },
              {
                path: "/profile",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <Profile />
                  </Suspense>
                ),
              },
              {
                path: "/subscription",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <Subscription />
                  </Suspense>
                ),
              },
              {
                path: "/subscription/make-payment",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <MakePayment />
                  </Suspense>
                ),
              },
              {
                path: "/mock-exam/result",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <MockResult />
                  </Suspense>
                ),
              },
              {
                path: "/past-questions/view",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <ViewPastQuestion />
                  </Suspense>
                ),
              },
              {
                path: "/past-questions/result",
                element: (
                  <Suspense fallback={<InvisibleFallback />}>
                    <ResultPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "mock-exam/:subjectId",
            element: (
              <Suspense fallback={<InvisibleFallback />}>
                <ExamBody />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/data-deletion",
        element: (
          <Suspense fallback={<InvisibleFallback />}>
            <Facebookredirect />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
