import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from './shared/components/Navbar';
import { LoginPage } from './modules/auth/LoginPage';
import { LanguageHubPage } from './modules/language-hub/LanguageHubPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { StudyPage } from './modules/study/StudyPage';
import { SessionSummaryPage } from './modules/study/SessionSummaryPage';
import { DecksPage } from './modules/decks/DecksPage';
import { VocabularyPage } from './modules/vocabulary/VocabularyPage';
import { DataHealthPage } from './modules/health/DataHealthPage';
import { StatisticsPage } from './modules/statistics/StatisticsPage';
import { AccountPage } from './modules/account/AccountPage';
import { Language } from './shared/types';

const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentLanguage={lang} />
      <main className="flex-1 overflow-x-hidden">
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const GeneralLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Language Hub */}
        <Route path="/select-language" element={<LanguageHubPage />} />

        {/* Language-specific workspace routes */}
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="decks" element={<DecksPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="health" element={<DataHealthPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>

        {/* Focused Study Routes (no general navbar to maximize focus) */}
        <Route path="/:lang/study" element={<StudyPage />} />
        <Route path="/:lang/study/summary" element={<SessionSummaryPage />} />

        {/* Account & Settings */}
        <Route element={<GeneralLayout />}>
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/select-language" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
