import { useState } from 'react';
import { HomeTab } from './components/HomeTab';
import { SearchTab } from './components/SearchTab';
import { ExerciseTab } from './components/ExerciseTab';
import { DietTab } from './components/DietTab';
import { CalendarTab } from './components/CalendarTab';
import { ProfileSheet } from './components/ProfileSheet';
import { ProfilePage } from './components/ProfilePage';
import { LoginPage } from './components/LoginPage';
import { Home, Search, Dumbbell, Apple, Calendar, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

type TabType = 'home' | 'search' | 'exercise' | 'diet' | 'calendar' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true by default, false when logged out
  const caloriesBurned = 2180; // From HomeTab leaderboard - current user's calories burned

  // Apply dark mode to document root for portals (like Dialog)
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative">
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Profile Page - Full screen when active */}
        {activeTab === 'profile' && (
          <ProfilePage 
            onBack={() => setActiveTab('home')} 
            isDarkMode={isDarkMode}
          />
        )}

        {/* Main App - Hidden when profile is active */}
        {activeTab !== 'profile' && (
          <>
            {/* Status Bar */}
            <div className={`h-12 flex items-center justify-between px-4 ${
              activeTab === 'diet'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800'
            }`}>
          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Open profile"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
              <AvatarFallback className="bg-white text-blue-600 text-sm">JD</AvatarFallback>
            </Avatar>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
          {activeTab === 'search' && <SearchTab />}
          {activeTab === 'exercise' && <ExerciseTab />}
          {activeTab === 'diet' && <DietTab caloriesBurned={caloriesBurned} />}
          {activeTab === 'calendar' && <CalendarTab />}
        </div>

        {/* Profile Sheet */}
        <ProfileSheet 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          isDarkMode={isDarkMode}
          onViewProfile={() => setActiveTab('profile')}
          onLogout={() => setIsLoggedIn(false)}
        />

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <nav className="flex items-center justify-around px-2 py-2 pb-safe">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 bg-gray-50 dark:bg-gray-700'
                : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'text-indigo-600 dark:text-indigo-400 fill-current' : ''}`} />
            <span className={`text-xs ${activeTab === 'calendar' ? 'text-gray-700 dark:text-gray-300' : ''}`}>Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'search'
                ? 'text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 bg-gray-50 dark:bg-gray-700'
                : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'
            }`}
          >
            <Search className={`w-5 h-5 ${activeTab === 'search' ? 'fill-current' : ''}`} />
            <span className="text-xs">Search</span>
          </button>

          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'exercise'
                ? 'border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'
            }`}
          >
            <Dumbbell className={`w-5 h-5 ${activeTab === 'exercise' ? 'text-orange-600 dark:text-orange-400 fill-current' : ''}`} />
            <span className={`text-xs ${activeTab === 'exercise' ? 'text-gray-700 dark:text-gray-300' : ''}`}>Exercise</span>
          </button>

          <button
            onClick={() => setActiveTab('diet')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'diet'
                ? 'border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'
            }`}
          >
            <Apple className={`w-5 h-5 ${activeTab === 'diet' ? 'text-green-600 dark:text-green-400 fill-current' : ''}`} />
            <span className={`text-xs ${activeTab === 'diet' ? 'text-gray-700 dark:text-gray-300' : ''}`}>Diet</span>
          </button>
            </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
