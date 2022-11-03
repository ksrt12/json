import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/Loader";
import MainPage from "./pages/MainPage";
import SSPVO from "./pages/SSPVO";
import "./app.scss";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/json/main" element={<MainPage />} />
                    <Route path="/json/sspvo" element={<SSPVO />} />
                    <Route path="*" element={<Navigate to="/json/main" replace />} />
                </Routes>
            </Suspense>
            <div className="copyright">
                <a target="_blank" rel="noreferrer" href="https://vk.com/kazakovstepan">&copy; 2020-2022, kazakovstepan</a>
            </div>
        </BrowserRouter>
    );
};

export default App;