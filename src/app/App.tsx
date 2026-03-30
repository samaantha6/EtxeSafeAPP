import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ClaimsProvider } from "../context/ClaimsContext.tsx";

export default function App() {
  return (
    <ClaimsProvider>
      <RouterProvider router={router} />
    </ClaimsProvider>
  );
}