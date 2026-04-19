import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MomoLayout } from "@/components/momo/MomoLayout";
import Dashboard from "./pages/Dashboard";
import Architecture from "./pages/Architecture";
import Command from "./pages/Command";
import Devices from "./pages/Devices";
import Memory from "./pages/Memory";
import Metrics from "./pages/Metrics";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MomoLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/command" element={<Command />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/security" element={<Security />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
