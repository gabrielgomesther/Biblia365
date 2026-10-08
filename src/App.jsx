import { Toaster } from "@/components/ui/toaster";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import PageNotFound from "@/lib/PageNotFound";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Estudos from "@/pages/Estudos";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estudos" element={<Estudos />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HashRouter>
        <ScrollToTop />
        <AppRoutes />
      </HashRouter>
      <Toaster />
    </ThemeProvider>
  );
}
