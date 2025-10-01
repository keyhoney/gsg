import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RootLayout } from "@/views/RootLayout";
import { LandingPage } from "@/views/LandingPage";
import { TestPage } from "@/views/TestPage";
import { ProblemPage } from "@/views/ProblemPage";
import { AuthEmailPage } from "@/views/auth/AuthEmailPage";
import { AuthOtpPage } from "@/views/auth/AuthOtpPage";
import { ChallengePage } from "@/views/challenge/ChallengePage";
import { ExplanationPage } from "@/views/explanation/ExplanationPage";
import { NotFoundPage } from "@/views/NotFoundPage";
import { GuardedLoader } from "@/views/loader/GuardedLoader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
      {
        path: "problem/:bookId/:problemId",
        element: <ProblemPage />,
        loader: GuardedLoader,
      },
      {
        path: "explanation",
        element: <ExplanationPage />,
        loader: GuardedLoader,
      },
      {
        path: "auth/email",
        element: <AuthEmailPage />,
      },
      {
        path: "auth/otp",
        element: <AuthOtpPage />,
      },
      {
        path: "challenge",
        element: <ChallengePage />,
        loader: GuardedLoader,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
