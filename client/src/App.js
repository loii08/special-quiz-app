import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizPage from './pages/QuizPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// A dedicated layout for protected routes
const PrivateRoutesLayout = () => (
  <PrivateRoute>
    <Outlet />
  </PrivateRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<PrivateRoutesLayout />}>
            <Route path="/create" element={<CreateQuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit/:quizId" element={<CreateQuizPage />} />
          </Route>
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;