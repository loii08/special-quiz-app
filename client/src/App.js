import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'; // Your main stylesheet
import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizPage from './pages/QuizPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/create" 
            element={<PrivateRoute><CreateQuizPage /></PrivateRoute>} 
          />
          <Route 
            path="/profile" 
            element={<PrivateRoute><ProfilePage /></PrivateRoute>} 
          />
          <Route 
            path="/edit/:quizId" 
            element={<PrivateRoute><CreateQuizPage /></PrivateRoute>} 
          />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;