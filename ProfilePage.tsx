import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Settings, Award, TrendingUp, Calendar, Target, Flame, MapPin, Edit, Share2, Mail, Lock, User, Weight, Ruler, Cake } from 'lucide-react';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

interface ProfileData {
  email: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
}

const PROFILE_STORAGE_KEY = 'fitness_app_profile_data';

export function ProfilePage({ onBack, isDarkMode = false }: ProfilePageProps) {
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Personal info state - with default values
  const [email, setEmail] = useState('john.doe@example.com');
  const [age, setAge] = useState('28');
  const [weight, setWeight] = useState('180');
  const [height, setHeight] = useState('5\'11"');
  const [gender, setGender] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('1997-03-15');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedData) {
      try {
        const profileData: ProfileData = JSON.parse(savedData);
        setEmail(profileData.email);
        setAge(profileData.age);
        setWeight(profileData.weight);
        setHeight(profileData.height);
        setGender(profileData.gender);
        setDateOfBirth(profileData.dateOfBirth);
        setProfileImage(profileData.profileImage);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollY(scrollContainerRef.current.scrollTop);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Show header avatar when scrolled past the profile section (approximately 280px)
  const showHeaderAvatar = scrollY > 280;
  
  const saveProfileData = () => {
    const profileData: ProfileData = {
      email,
      age,
      weight,
      height,
      gender,
      dateOfBirth,
      profileImage,
    };
    
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      console.error('Failed to save profile data:', error);
      toast.error('Failed to save profile', {
        description: 'Please try again.',
      });
    }
  };

  const handlePasswordChange = () => {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please make sure your new passwords match.',
      });
      return;
    }
    
    // Validate password length
    if (newPassword.length < 8) {
      toast.error('Password too short', {
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }
    
    // Here you would normally make an API call to change the password
    console.log('Changing password...');
    toast.success('Password changed successfully!', {
      description: 'Your password has been updated.',
    });
    setShowPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleProfileImageClick = () => {
    console.log('Edit button clicked');
    console.log('File input ref:', fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log('File input clicked');
    } else {
      console.error('File input ref is null');
      toast.error('Error', {
        description: 'Unable to open file picker. Please try again.',
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed', event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please select an image file.',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Image size should be less than 5MB.',
        });
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Image loaded successfully');
        setProfileImage(reader.result as string);
        toast.success('Profile picture updated!', {
          description: 'Don\'t forget to save your changes.',
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 dark:from-blue-700 dark:via-purple-800 dark:to-pink-700">
        <div className="h-12 flex items-center justify-between px-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Header Avatar - Shows when scrolled */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
              showHeaderAvatar ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <Avatar className="w-9 h-9 border-2 border-white dark:border-gray-900">
              <AvatarImage src={profileImage} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">JD</AvatarFallback>
            </Avatar>
          </div>

          {/* Settings Button */}
          <button className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-24 bg-gray-50 dark:bg-gray-900"
      >
        {/* Header with Cover Photo */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 dark:from-blue-700 dark:via-purple-800 dark:to-pink-700" />
          
          {/* Profile Picture - Positioned over the cover */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">JD</AvatarFallback>
              </Avatar>
              <button 
                onClick={handleProfileImageClick}
                type="button"
                aria-label="Edit profile picture"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white dark:border-gray-900 transition-colors z-10 cursor-pointer shadow-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            {/* Hidden file input - moved outside to avoid any parent-child interaction issues */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="px-4 pt-20">
          {/* User Info */}
          <div className="text-center mb-6">
            <h1 className="text-gray-900 dark:text-gray-100 mb-1">John Doe</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Fitness Enthusiast</p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Bio */}
          <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">About Me</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💪 Dedicated to building a healthier lifestyle. Love running, weightlifting, and exploring new fitness challenges. Always looking to improve and inspire others!
            </p>
          </CardContent>
        </Card>

          {/* Personal Information */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-gray-100">Personal Information</h3>
                <User className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Change Password */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    Age
                  </Label>
                  <Input 
                    id="age"
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </Label>
                  <Input 
                    id="dob"
                    type="date" 
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm text-gray-600 dark:text-gray-400">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    Weight (lbs)
                  </Label>
                  <Input 
                    id="weight"
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Height
                  </Label>
                  <Input 
                    id="height"
                    type="text" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 5'11 or 180cm"
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Save Button */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                  onClick={saveProfileData}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-blue-600 dark:text-blue-400 mb-1">156</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Workouts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600 dark:text-green-400 mb-1">23</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-orange-600 dark:text-orange-400 mb-1">8.2k</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            </CardContent>
          </Card>
          </div>

          {/* Achievements */}
          <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 dark:text-gray-100">Achievements</h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100">Fire Streak</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">23/30 days</span>
                  </div>
                  <Progress value={76.6} className="h-2" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100">Personal Best</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">8/10 PRs</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100">Goal Crusher</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">12/15 goals</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
          </Card>

          {/* Monthly Activity */}
          <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 dark:text-gray-100">Monthly Activity</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Workouts</div>
                <div className="text-2xl text-gray-900 dark:text-gray-100">32</div>
                <div className="text-xs text-green-600 dark:text-green-400">+12% from last month</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Volume</div>
                <div className="text-2xl text-gray-900 dark:text-gray-100">125k</div>
                <div className="text-xs text-green-600 dark:text-green-400">+8% from last month</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Calories Burned</div>
                <div className="text-2xl text-gray-900 dark:text-gray-100">18.2k</div>
                <div className="text-xs text-green-600 dark:text-green-400">+5% from last month</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Days</div>
                <div className="text-2xl text-gray-900 dark:text-gray-100">23</div>
                <div className="text-xs text-green-600 dark:text-green-400">On track!</div>
              </div>
            </div>
          </CardContent>
          </Card>

          {/* Personal Records */}
          <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-gray-900 dark:text-gray-100 mb-4">Personal Records</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">Barbell Squat</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Nov 3, 2025</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 dark:text-blue-400">315 lbs</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+10 lbs</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">Bench Press</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Oct 28, 2025</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 dark:text-blue-400">245 lbs</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+5 lbs</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">Deadlift</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Oct 15, 2025</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 dark:text-blue-400">405 lbs</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+15 lbs</div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
