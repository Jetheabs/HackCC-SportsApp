import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Card, CardContent } from './ui/card';
import { User, Mail, Phone, Calendar, Settings, Bell, Lock, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export function ProfileSheet({ isOpen, onClose, isDarkMode = false }: ProfileSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className={`w-[300px] ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : ''}`}>
        <SheetHeader>
          <SheetTitle className="dark:text-gray-100">Profile</SheetTitle>
          <SheetDescription className="dark:text-gray-400">
            View and manage your profile information
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* User Info */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">JD</AvatarFallback>
            </Avatar>
            <h2 className="dark:text-gray-100">John Doe</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fitness Enthusiast</p>
          </div>

          {/* Stats */}
          <div className="px-6">
            <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl text-blue-600 dark:text-blue-400">156</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Workouts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl text-green-600 dark:text-green-400">23</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl text-orange-600 dark:text-orange-400">8.2k</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* User Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm dark:text-gray-300">john.doe@email.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm dark:text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm dark:text-gray-300">Joined Jan 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Settings Options */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:bg-gray-800">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:bg-gray-800">
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-gray-300 dark:hover:bg-gray-800">
              <Lock className="w-4 h-4 mr-3" />
              Privacy
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:bg-gray-800">
              <LogOut className="w-4 h-4 mr-3" />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
