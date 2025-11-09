import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Dumbbell, Apple, Calendar, TrendingUp, Flame, Footprints, Target, ChevronRight, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface LeaderboardUser {
  rank: number;
  name: string;
  value: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const stepsLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Sarah Chen', value: 15420, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { rank: 2, name: 'Mike Johnson', value: 14200, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { rank: 3, name: 'Emma Davis', value: 13800, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { rank: 4, name: 'Alex Kim', value: 12500, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { rank: 5, name: 'John Doe', value: 11200, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isCurrentUser: true },
  { rank: 6, name: 'Lisa Park', value: 10800, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { rank: 7, name: 'Chris Lee', value: 9600, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { rank: 8, name: 'Maya Singh', value: 8900, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
];

const caloriesLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Mike Johnson', value: 2840, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { rank: 2, name: 'Emma Davis', value: 2650, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { rank: 3, name: 'Sarah Chen', value: 2420, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { rank: 4, name: 'John Doe', value: 2180, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isCurrentUser: true },
  { rank: 5, name: 'Alex Kim', value: 2050, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { rank: 6, name: 'Lisa Park', value: 1920, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { rank: 7, name: 'Chris Lee', value: 1780, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { rank: 8, name: 'Maya Singh', value: 1650, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
];

interface HomeTabProps {
  onNavigate: (tab: 'exercise' | 'diet' | 'calendar') => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  const [activeLeaderboard, setActiveLeaderboard] = useState<'steps' | 'calories'>('steps');
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [showAllRankings, setShowAllRankings] = useState(false);

  const currentUserSteps = stepsLeaderboard.find(u => u.isCurrentUser)!;
  const currentUserCalories = caloriesLeaderboard.find(u => u.isCurrentUser)!;
  const stepsGoal = 15000;
  const caloriesGoal = 2500;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = 100;
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        setScrollOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leaderboardData = activeLeaderboard === 'steps' ? stepsLeaderboard : caloriesLeaderboard;

  return (
    <div className="pb-24">
      {/* Compact Header */}
      <div 
        className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white px-5 pt-6 pb-10 transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <div className="space-y-1.5">
          <p className="text-white/90">Welcome back,</p>
          <h1 className="text-white">John Doe</h1>
          <p className="text-white/80">Let's crush your goals today 💪</p>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="px-4 -mt-8 grid grid-cols-2 gap-3 mb-5">
        {/* Steps Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Footprints className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <span className="text-gray-500 dark:text-gray-400">#{currentUserSteps.rank}</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl tabular-nums text-gray-900 dark:text-gray-100">{currentUserSteps.value.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-400">Steps Today</div>
              <Progress value={(currentUserSteps.value / stepsGoal) * 100} className="h-2" />
              <div className="text-sm text-gray-500 dark:text-gray-500">{stepsGoal.toLocaleString()} goal</div>
            </div>
          </CardContent>
        </Card>

        {/* Calories Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              <span className="text-gray-500 dark:text-gray-400">#{currentUserCalories.rank}</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl tabular-nums text-gray-900 dark:text-gray-100">{currentUserCalories.value.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-400">Calories Burned</div>
              <Progress value={(currentUserCalories.value / caloriesGoal) * 100} className="h-2" />
              <div className="text-sm text-gray-500 dark:text-gray-500">{caloriesGoal.toLocaleString()} goal</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-gray-100">Leaderboard</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLeaderboard('steps')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeLeaderboard === 'steps'
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              Steps
            </button>
            <button
              onClick={() => setActiveLeaderboard('calories')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeLeaderboard === 'calories'
                  ? 'bg-orange-500 text-white dark:bg-orange-600'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              Calories
            </button>
          </div>
        </div>

        <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaderboardData.slice(0, 5).map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 transition-colors ${
                    user.isCurrentUser
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : index === 2
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                      : user.isCurrentUser
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.rank}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-[15px] ${
                      user.isCurrentUser
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {user.name}
                    </p>
                    <p className="text-[15px] text-gray-500 dark:text-gray-400 tabular-nums">
                      {user.value.toLocaleString()} {activeLeaderboard === 'steps' ? 'steps' : 'cal'}
                    </p>
                  </div>

                  {/* Trend Icon */}
                  {user.isCurrentUser && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button 
              onClick={() => setShowAllRankings(true)}
              className="w-full p-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-1"
            >
              View All Rankings
              <ChevronRight className="w-5 h-5" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-5">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        
        <div className="space-y-3">
          {/* Exercise Card */}
          <Card 
            onClick={() => onNavigate('exercise')}
            className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-gray-100 mb-0.5">Exercise</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track your workouts</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Diet Card */}
          <Card 
            onClick={() => onNavigate('diet')}
            className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <Apple className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-gray-100 mb-0.5">Diet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Log your meals</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card 
            onClick={() => onNavigate('calendar')}
            className="dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-gray-100 mb-0.5">Calendar</h3>
                  <p className="text-gray-600 dark:text-gray-400">Schedule workouts</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="px-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-gray-100 mb-2">Daily Goal Progress</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Keep going! You're {Math.round((currentUserSteps.value / stepsGoal) * 100)}% to your step goal.
                </p>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {(stepsGoal - currentUserSteps.value).toLocaleString()} steps remaining
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Rankings Dialog */}
      <Dialog open={showAllRankings} onOpenChange={setShowAllRankings}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {activeLeaderboard === 'steps' ? 'Steps' : 'Calories'} Leaderboard
            </DialogTitle>
            <DialogDescription>
              View complete rankings for {activeLeaderboard === 'steps' ? 'daily steps' : 'calories burned'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveLeaderboard('steps')}
              className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
                activeLeaderboard === 'steps'
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Steps
            </button>
            <button
              onClick={() => setActiveLeaderboard('calories')}
              className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
                activeLeaderboard === 'calories'
                  ? 'bg-orange-500 text-white dark:bg-orange-600'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              Calories
            </button>
          </div>

          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    user.isCurrentUser
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-11 h-11 rounded-full ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : index === 2
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                      : user.isCurrentUser
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.rank}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-[15px] ${
                      user.isCurrentUser
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {user.name}
                    </p>
                    <p className="text-[15px] text-gray-500 dark:text-gray-400 tabular-nums">
                      {user.value.toLocaleString()} {activeLeaderboard === 'steps' ? 'steps' : 'cal'}
                    </p>
                  </div>

                  {/* Trend Icon for current user */}
                  {user.isCurrentUser && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
