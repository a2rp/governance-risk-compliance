import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import ScrollToTop from "./components/scrollToTop";

const OverviewPage = lazy(() => import("./pages/overview/index.jsx"));
const ControlsPage = lazy(() => import("./pages/controls/index.jsx"));
const AuditsPage = lazy(() => import("./pages/audits/index.jsx"));
const IssuesPage = lazy(() => import("./pages/issues/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({ workspace, notify }) => {
    const location = useLocation();
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loading />} key={location.pathname}>
                <Routes location={location}>
                    <Route element={<OverviewPage {...workspace} />} path="/" />
                    <Route element={<ControlsPage {...workspace} notify={notify} />} path="/controls" />
                    <Route element={<AuditsPage {...workspace} notify={notify} />} path="/audits" />
                    <Route element={<IssuesPage {...workspace} notify={notify} />} path="/issues" />
                    <Route element={<NotFoundPage />} path="*" />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;