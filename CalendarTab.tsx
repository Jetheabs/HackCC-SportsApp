import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ChevronUp, ChevronDown, ArrowRight, Plus, X, Calendar as CalendarIcon, Dumbbell, Moon } from 'lucide-react';
import { ExerciseInLibrary, WorkoutDayInLibrary, Split, WorkoutRoutine, Exercise } from '../App';

interface CalendarTabProps {
  exerciseLibrary: ExerciseInLibrary[];
  setExerciseLibrary: React.Dispatch<React.SetStateAction<ExerciseInLibrary[]>>;
  dayLibrary: WorkoutDayInLibrary[];
  setDayLibrary: React.Dispatch<React.SetStateAction<WorkoutDayInLibrary[]>>;
  splits: Split[];
  setSplits: React.Dispatch<React.SetStateAction<Split[]>>;
  activeSplitId: string | null;
  setActiveSplitId: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export function CalendarTab({ 
  exerciseLibrary, 
  setExerciseLibrary,
  dayLibrary,
  setDayLibrary,
  splits,
  setSplits,
  activeSplitId,
  setActiveSplitId
}: CalendarTabProps) {
  const [showCreateSplitDialog, setShowCreateSplitDialog] = useState(false);
  const [newSplitName, setNewSplitName] = useState('');
  const [newSplitType, setNewSplitType] = useState<'rotational' | 'weekly'>('rotational');
  const [rotationalDayCount, setRotationalDayCount] = useState(3);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedWeekday, setSelectedWeekday] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Omit<WorkoutDayInLibrary, 'id' | 'usedInSplits'>>({ 
    name: '', 
    exercises: [], 
    isRestDay: false 
  });
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    warmupSets: 0,
    warmupReps: 0,
    workingSets: 3,
    workingReps: 10
  });
  const [showDayTypeDialog, setShowDayTypeDialog] = useState(false);
  const [pendingWeekday, setPendingWeekday] = useState<string | null>(null);
  const [showSelectExistingDayDialog, setShowSelectExistingDayDialog] = useState(false);
  const [pendingDayIndexForExisting, setPendingDayIndexForExisting] = useState<number | null>(null);
  const [isAssigningWeeklyDays, setIsAssigningWeeklyDays] = useState(false);
  const [tempWeeklySplitId, setTempWeeklySplitId] = useState<string | null>(null);
  const [isAssigningRotationalDays, setIsAssigningRotationalDays] = useState(false);
  const [tempRotationalSplitId, setTempRotationalSplitId] = useState<string | null>(null);
  const [rotationalDaySlots, setRotationalDaySlots] = useState<(string | null)[]>([]);
  const [pendingRotationalDayIndex, setPendingRotationalDayIndex] = useState<number | null>(null);

  const activeSplit = splits.find(s => s.id === activeSplitId);
  const routine = activeSplit?.routine || null;

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekdayLabels: { [key: string]: string } = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  // Helper function to get day from library by ID
  const getDayById = (id: string) => dayLibrary.find(d => d.id === id);

  const getCurrentDay = () => {
    if (!routine) return null;
    
    if (routine.type === 'rotational') {
      const daysSinceStart = 0;
      const currentIndex = daysSinceStart % routine.dayIds.length;
      const dayId = routine.dayIds[currentIndex];
      return getDayById(dayId);
    } else {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayId = routine.days[today as keyof typeof routine.days];
      return dayId ? getDayById(dayId) : null;
    }
  };

  const getNext7Days = () => {
    if (!routine) return [];
    
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      
      let workout = null;
      
      if (routine.type === 'rotational') {
        const daysSinceStart = i;
        const currentIndex = daysSinceStart % routine.dayIds.length;
        const dayId = routine.dayIds[currentIndex];
        workout = getDayById(dayId);
      } else {
        const dayName = weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const dayId = routine.days[dayName as keyof typeof routine.days];
        workout = dayId ? getDayById(dayId) : null;
      }
      
      result.push({
        dayOfWeek,
        dayNum,
        workout
      });
    }
    
    return result;
  };

  const handleCreateSplit = () => {
    if (!newSplitName.trim()) return;

    const newId = `split-${Date.now()}`;
    let newRoutine: WorkoutRoutine | null = null;

    if (newSplitType === 'rotational') {
      // Create empty day IDs array for rotational
      newRoutine = {
        type: 'rotational',
        dayIds: []
      };
      
      const newSplit: Split = {
        id: newId,
        name: newSplitName,
        routine: newRoutine
      };

      setSplits([...splits, newSplit]);
      setActiveSplitId(newId);
      setTempRotationalSplitId(newId);
      setRotationalDaySlots(new Array(rotationalDayCount).fill(null));
      setIsAssigningRotationalDays(true);
      // Don't close the dialog or reset form yet - stay in assignment mode
    } else {
      // Create empty weekly split
      newRoutine = {
        type: 'weekly',
        days: {}
      };
      
      const newSplit: Split = {
        id: newId,
        name: newSplitName,
        routine: newRoutine
      };

      setSplits([...splits, newSplit]);
      setActiveSplitId(newId);
      setTempWeeklySplitId(newId);
      setIsAssigningWeeklyDays(true);
      // Don't close the dialog or reset form yet - stay in assignment mode
    }
  };

  const handleFinishWeeklyAssignment = () => {
    setIsAssigningWeeklyDays(false);
    setTempWeeklySplitId(null);
    setNewSplitName('');
    setShowCreateSplitDialog(false);
  };

  const handleFinishRotationalAssignment = () => {
    // Update the split with the assigned day IDs
    if (tempRotationalSplitId) {
      setSplits(splits.map(s => {
        if (s.id === tempRotationalSplitId && s.routine?.type === 'rotational') {
          return {
            ...s,
            routine: {
              ...s.routine,
              dayIds: rotationalDaySlots.filter((id): id is string => id !== null)
            }
          };
        }
        return s;
      }));
    }
    setIsAssigningRotationalDays(false);
    setTempRotationalSplitId(null);
    setRotationalDaySlots([]);
    setNewSplitName('');
    setShowCreateSplitDialog(false);
  };

  const handleRotationalDayClick = (index: number) => {
    const dayId = rotationalDaySlots[index];
    if (dayId) {
      // Edit existing day
      const day = getDayById(dayId);
      if (day) {
        setSelectedDayId(dayId);
        setPendingRotationalDayIndex(index);
        setEditingWorkout({
          name: day.name,
          exercises: [...day.exercises],
          isRestDay: day.isRestDay,
          color: day.color
        });
      }
    } else {
      // Create new day for this slot
      setPendingRotationalDayIndex(index);
      setShowDayTypeDialog(true);
    }
  };

  const handleDayClick = (dayId?: string, weekday?: string) => {
    if (dayId) {
      const day = getDayById(dayId);
      if (day) {
        setSelectedDayId(dayId);
        setEditingWorkout({
          name: day.name,
          exercises: [...day.exercises],
          isRestDay: day.isRestDay,
          color: day.color
        });
      }
    } else if (weekday) {
      // Check if we're in weekly assignment mode
      const currentRoutine = isAssigningWeeklyDays && tempWeeklySplitId 
        ? splits.find(s => s.id === tempWeeklySplitId)?.routine 
        : routine;
      
      const dayId = currentRoutine?.type === 'weekly' ? currentRoutine.days[weekday as keyof typeof currentRoutine.days] : null;
      if (dayId) {
        const day = getDayById(dayId);
        if (day) {
          setSelectedWeekday(weekday);
          setSelectedDayId(dayId);
          setEditingWorkout({
            name: day.name,
            exercises: [...day.exercises],
            isRestDay: day.isRestDay,
            color: day.color
          });
        }
      } else {
        // Show dialog to choose workout day or rest day
        setPendingWeekday(weekday);
        setShowDayTypeDialog(true);
      }
    }
  };

  const handleDayTypeSelection = (isWorkoutDay: boolean) => {
    setShowDayTypeDialog(false);
    
    if (!isWorkoutDay) {
      // Create a rest day
      const newDayId = `day-${Date.now()}`;
      const targetSplit = isAssigningWeeklyDays && tempWeeklySplitId 
        ? splits.find(s => s.id === tempWeeklySplitId)
        : isAssigningRotationalDays && tempRotationalSplitId
        ? splits.find(s => s.id === tempRotationalSplitId)
        : activeSplit;
      
      const restDay: WorkoutDayInLibrary = {
        id: newDayId,
        name: 'Rest Day',
        exercises: [],
        isRestDay: true,
        usedInSplits: targetSplit ? [{ splitId: targetSplit.id, splitName: targetSplit.name }] : []
      };
      
      setDayLibrary([...dayLibrary, restDay]);
      
      // Update the split to use this day
      if (isAssigningRotationalDays && pendingRotationalDayIndex !== null) {
        // Update rotational day slot
        const newSlots = [...rotationalDaySlots];
        newSlots[pendingRotationalDayIndex] = newDayId;
        setRotationalDaySlots(newSlots);
        setPendingRotationalDayIndex(null);
      } else if (pendingWeekday) {
        const targetSplitId = isAssigningWeeklyDays && tempWeeklySplitId ? tempWeeklySplitId : activeSplitId;
        setSplits(splits.map(s => {
          if (s.id === targetSplitId && s.routine?.type === 'weekly') {
            return {
              ...s,
              routine: {
                ...s.routine,
                days: {
                  ...s.routine.days,
                  [pendingWeekday]: newDayId
                }
              }
            };
          }
          return s;
        }));
        setPendingWeekday(null);
      }
    } else {
      // Set up for creating a workout day
      if (isAssigningRotationalDays) {
        // For rotational, we just need to set the editing state
        setEditingWorkout({
          name: '',
          exercises: [],
          isRestDay: false
        });
        setShowSetupDialog(true); // Open the dialog explicitly
      } else {
        setSelectedWeekday(pendingWeekday);
        setPendingWeekday(null);
        setEditingWorkout({
          name: '',
          exercises: [],
          isRestDay: false
        });
        setShowSetupDialog(true); // Open the dialog explicitly
      }
    }
  };

  const saveWorkoutDay = () => {
    if (!editingWorkout.name.trim() && !editingWorkout.isRestDay) return;

    if (selectedDayId) {
      // Update existing day in library
      setDayLibrary(dayLibrary.map(day => {
        if (day.id === selectedDayId) {
          return {
            ...day,
            name: editingWorkout.name,
            exercises: editingWorkout.exercises,
            color: editingWorkout.color
          };
        }
        return day;
      }));

      // Add exercises to exercise library
      editingWorkout.exercises.forEach(exercise => {
        const existingExercise = exerciseLibrary.find(e => e.name.toLowerCase() === exercise.name.toLowerCase());
        if (!existingExercise) {
          const newExerciseId = `exercise-${Date.now()}-${Math.random()}`;
          const newLibraryExercise: ExerciseInLibrary = {
            ...exercise,
            id: newExerciseId,
            usedInDays: [selectedDayId]
          };
          setExerciseLibrary(prev => [...prev, newLibraryExercise]);
        } else {
          // Update existing exercise to include this day
          if (!existingExercise.usedInDays.includes(selectedDayId)) {
            setExerciseLibrary(prev => prev.map(e => 
              e.id === existingExercise.id 
                ? { ...e, usedInDays: [...e.usedInDays, selectedDayId] }
                : e
            ));
          }
        }
      });
    } else {
      // Create new day
      const newDayId = `day-${Date.now()}`;
      const targetSplit = isAssigningWeeklyDays && tempWeeklySplitId 
        ? splits.find(s => s.id === tempWeeklySplitId)
        : isAssigningRotationalDays && tempRotationalSplitId
        ? splits.find(s => s.id === tempRotationalSplitId)
        : activeSplit;
      
      const newDay: WorkoutDayInLibrary = {
        id: newDayId,
        name: editingWorkout.name,
        exercises: editingWorkout.exercises,
        isRestDay: editingWorkout.isRestDay,
        color: editingWorkout.color || defaultColors[dayLibrary.length % defaultColors.length],
        usedInSplits: targetSplit ? [{ splitId: targetSplit.id, splitName: targetSplit.name }] : []
      };
      
      setDayLibrary([...dayLibrary, newDay]);

      // Add exercises to exercise library
      editingWorkout.exercises.forEach(exercise => {
        const existingExercise = exerciseLibrary.find(e => e.name.toLowerCase() === exercise.name.toLowerCase());
        if (!existingExercise) {
          const newExerciseId = `exercise-${Date.now()}-${Math.random()}`;
          const newLibraryExercise: ExerciseInLibrary = {
            ...exercise,
            id: newExerciseId,
            usedInDays: [newDayId]
          };
          setExerciseLibrary(prev => [...prev, newLibraryExercise]);
        } else {
          // Update existing exercise to include this day
          if (!existingExercise.usedInDays.includes(newDayId)) {
            setExerciseLibrary(prev => prev.map(e => 
              e.id === existingExercise.id 
                ? { ...e, usedInDays: [...e.usedInDays, newDayId] }
                : e
            ));
          }
        }
      });

      // Update the split to use this new day
      if (isAssigningRotationalDays && pendingRotationalDayIndex !== null) {
        // Update rotational day slot
        const newSlots = [...rotationalDaySlots];
        newSlots[pendingRotationalDayIndex] = newDayId;
        setRotationalDaySlots(newSlots);
        setPendingRotationalDayIndex(null);
      } else {
        const targetSplitId = isAssigningWeeklyDays && tempWeeklySplitId ? tempWeeklySplitId : activeSplitId;
        if (selectedWeekday) {
          setSplits(splits.map(s => {
            if (s.id === targetSplitId && s.routine?.type === 'weekly') {
              return {
                ...s,
                routine: {
                  ...s.routine,
                  days: {
                    ...s.routine.days,
                    [selectedWeekday]: newDayId
                  }
                }
              };
            }
            return s;
          }));
        }
      }
    }

    // Close the dialog and reset states
    setShowSetupDialog(false);
    setSelectedDayId(null);
    setSelectedWeekday(null);
    setEditingWorkout({ name: '', exercises: [], isRestDay: false });
  };

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return;

    setEditingWorkout({
      ...editingWorkout,
      exercises: [...editingWorkout.exercises, { ...newExercise }]
    });

    setNewExercise({
      name: '',
      warmupSets: 0,
      warmupReps: 0,
      workingSets: 3,
      workingReps: 10
    });
  };

  const handleRemoveExercise = (index: number) => {
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.filter((_, i) => i !== index)
    });
  };

  if (!activeSplit || !routine) {
    return (
      <div className="px-4 pt-4 pb-24 space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">No Active Split</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create a new split to get started
            </p>
            <Button onClick={() => setShowCreateSplitDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Split
            </Button>
          </CardContent>
        </Card>

        {/* Create Split Dialog */}
        <Dialog open={showCreateSplitDialog} onOpenChange={setShowCreateSplitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Split</DialogTitle>
              <DialogDescription>
                Configure your workout split
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Split Name</Label>
                <Input
                  value={newSplitName}
                  onChange={(e) => setNewSplitName(e.target.value)}
                  placeholder="e.g., Push Pull Legs, Upper Lower, etc."
                />
              </div>
              
              <div>
                <Label className="block mb-2">Split Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={newSplitType === 'rotational' ? 'default' : 'outline'}
                    onClick={() => setNewSplitType('rotational')}
                    className="w-full"
                  >
                    Rotational
                  </Button>
                  <Button
                    variant={newSplitType === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setNewSplitType('weekly')}
                    className="w-full"
                  >
                    Weekly
                  </Button>
                </div>
              </div>

              {newSplitType === 'rotational' && (
                <div>
                  <Label className="block mb-2">Number of Days</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRotationalDayCount(Math.max(1, rotationalDayCount - 1))}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{rotationalDayCount}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRotationalDayCount(Math.min(7, rotationalDayCount + 1))}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateSplit} className="w-full" disabled={!newSplitName.trim()}>
                Create Split
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      {/* Active Split Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{activeSplit?.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {routine.type === 'rotational' ? 'Rotational Split' : 'Weekly Split'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Day Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Today's Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getCurrentDay() ? (
            getCurrentDay()?.isRestDay ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Moon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">Rest Day</p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-3">{getCurrentDay()?.name}</h3>
                <div className="space-y-2">
                  {getCurrentDay()?.exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span>{exercise.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.workingSets} × {exercise.workingReps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Moon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No workout scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next 7 Days */}
      <Card key={`next7days-${activeSplitId}`}>
        <CardHeader className="pb-3">
          <CardTitle>Next 7 Days</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0">
          <div className="flex gap-3 min-w-max py-2">
            {getNext7Days().map((day, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center p-4 rounded-lg min-w-[80px] ${
                  idx === 0 
                    ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className={`text-xs mb-1 ${idx === 0 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {day.dayOfWeek}
                </div>
                <div className={`text-2xl font-semibold mb-2 ${idx === 0 ? 'text-white' : ''}`}>
                  {day.dayNum}
                </div>
                {day.workout ? (
                  day.workout.isRestDay ? (
                    <div className={`text-xs text-center font-medium ${idx === 0 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      Rest
                    </div>
                  ) : (
                    <div className={`text-xs text-center font-medium ${idx === 0 ? 'text-white' : ''}`}>
                      {day.workout.name}
                    </div>
                  )
                ) : (
                  <div className={`text-xs text-center font-medium ${idx === 0 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    -
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Routine Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Split</CardTitle>
        </CardHeader>
        <CardContent>
          {routine.type === 'rotational' ? (
            <div className="space-y-2">
              {routine.dayIds.map((dayId, index) => {
                const day = getDayById(dayId);
                return day ? (
                  <div
                    key={index}
                    onClick={() => handleDayClick(dayId)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-gray-100/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: day.color }}
                      />
                      <div>
                        <h4 className="font-medium">{day.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {day.exercises.length} exercises
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {weekdays.map((weekday) => {
                const dayId = routine.days[weekday as keyof typeof routine.days];
                const day = dayId ? getDayById(dayId) : null;
                return (
                  <div
                    key={weekday}
                    onClick={() => handleDayClick(dayId, weekday)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-gray-100/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {day?.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: day.color }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{weekdayLabels[weekday]}</h4>
                        <p className={`text-xs ${day ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {day ? `${day.name} - ${day.exercises.length} exercises` : 'Blank - Click to add'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Split Module */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={() => setShowCreateSplitDialog(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Split
          </Button>
        </CardContent>
      </Card>

      {/* Day Type Selection Dialog */}
      <Dialog open={showDayTypeDialog} onOpenChange={setShowDayTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Day Type</DialogTitle>
            <DialogDescription>
              Select whether this is a workout day or rest day
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleDayTypeSelection(true)}
              className="h-24 flex-col gap-2"
            >
              <Dumbbell className="w-8 h-8" />
              <span>Workout Day</span>
            </Button>
            <Button
              onClick={() => handleDayTypeSelection(false)}
              variant="outline"
              className="h-24 flex-col gap-2"
            >
              <Moon className="w-8 h-8" />
              <span>Rest Day</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Workout Dialog */}
      <Dialog open={showSetupDialog || (editingWorkout.name !== '' || editingWorkout.exercises.length > 0) && !showDayTypeDialog} onOpenChange={(open) => {
        if (!open) {
          setShowSetupDialog(false);
          setSelectedDayId(null);
          setSelectedWeekday(null);
          setEditingWorkout({ name: '', exercises: [], isRestDay: false });
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDayId ? 'Edit Workout' : 'Create Workout'}
            </DialogTitle>
            <DialogDescription>
              {isAssigningWeeklyDays && selectedWeekday ? `Configure workout for ${weekdayLabels[selectedWeekday]}` : isAssigningRotationalDays && pendingRotationalDayIndex !== null ? `Configure Day ${pendingRotationalDayIndex + 1}` : 'Add exercises to this workout day'}
            </DialogDescription>
          </DialogHeader>
          
          {!editingWorkout.isRestDay && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Workout Name</Label>
                <Input
                  value={editingWorkout.name}
                  onChange={(e) => setEditingWorkout({ ...editingWorkout, name: e.target.value })}
                  placeholder="e.g., Push Day, Leg Day, etc."
                />
              </div>

              {editingWorkout.exercises.length > 0 && (
                <div>
                  <Label className="block mb-2">Exercises</Label>
                  <div className="space-y-2">
                    {editingWorkout.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {exercise.warmupSets > 0 && `Warmup: ${exercise.warmupSets} × ${exercise.warmupReps} | `}
                            Working: {exercise.workingSets} × {exercise.workingReps}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveExercise(idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="block mb-3">Add Exercise</Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs block mb-1">Exercise Name</Label>
                    <Input
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="e.g., Bench Press"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs block mb-1">Warmup Sets</Label>
                      <Input
                        type="number"
                        value={newExercise.warmupSets}
                        onChange={(e) => setNewExercise({ ...newExercise, warmupSets: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs block mb-1">Warmup Reps</Label>
                      <Input
                        type="number"
                        value={newExercise.warmupReps}
                        onChange={(e) => setNewExercise({ ...newExercise, warmupReps: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs block mb-1">Working Sets</Label>
                      <Input
                        type="number"
                        value={newExercise.workingSets}
                        onChange={(e) => setNewExercise({ ...newExercise, workingSets: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs block mb-1">Working Reps</Label>
                      <Input
                        type="number"
                        value={newExercise.workingReps}
                        onChange={(e) => setNewExercise({ ...newExercise, workingReps: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleAddExercise}
                    className="w-full"
                    disabled={!newExercise.name.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </div>

              <Button 
                onClick={saveWorkoutDay} 
                className="w-full" 
                disabled={!editingWorkout.name.trim() || editingWorkout.exercises.length === 0}
              >
                Save Workout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Split Dialog */}
      <Dialog open={showCreateSplitDialog} onOpenChange={(open) => {
        setShowCreateSplitDialog(open);
        if (!open) {
          setIsAssigningWeeklyDays(false);
          setTempWeeklySplitId(null);
          setIsAssigningRotationalDays(false);
          setTempRotationalSplitId(null);
          setRotationalDaySlots([]);
          setNewSplitName('');
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAssigningWeeklyDays ? 'Assign Days to Week' : isAssigningRotationalDays ? 'Assign Rotational Days' : 'Create New Split'}
            </DialogTitle>
            <DialogDescription>
              {isAssigningWeeklyDays 
                ? 'Click on each day to add workout or rest day' 
                : isAssigningRotationalDays
                ? 'Click on each day slot to add workout or rest day'
                : 'Configure your workout split'}
            </DialogDescription>
          </DialogHeader>
          
          {!isAssigningWeeklyDays && !isAssigningRotationalDays ? (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Split Name</Label>
                <Input
                  value={newSplitName}
                  onChange={(e) => setNewSplitName(e.target.value)}
                  placeholder="e.g., Push Pull Legs, Upper Lower, etc."
                />
              </div>
              
              <div>
                <Label className="block mb-2">Split Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={newSplitType === 'rotational' ? 'default' : 'outline'}
                    onClick={() => setNewSplitType('rotational')}
                    className="w-full"
                  >
                    Rotational
                  </Button>
                  <Button
                    variant={newSplitType === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setNewSplitType('weekly')}
                    className="w-full"
                  >
                    Weekly
                  </Button>
                </div>
              </div>

              {newSplitType === 'rotational' && (
                <div>
                  <Label className="block mb-2">Number of Days</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRotationalDayCount(Math.max(1, rotationalDayCount - 1))}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{rotationalDayCount}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRotationalDayCount(Math.min(7, rotationalDayCount + 1))}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateSplit} className="w-full" disabled={!newSplitName.trim()}>
                Create Split
              </Button>
            </div>
          ) : isAssigningWeeklyDays ? (
            <div className="space-y-4">
              {weekdays.map((weekday) => {
                const tempSplit = splits.find(s => s.id === tempWeeklySplitId);
                const dayId = tempSplit?.routine?.type === 'weekly' ? tempSplit.routine.days[weekday as keyof typeof tempSplit.routine.days] : null;
                const day = dayId ? getDayById(dayId) : null;
                
                return (
                  <div
                    key={weekday}
                    onClick={() => {
                      handleDayClick(dayId, weekday);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-gray-100/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {day?.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: day.color }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{weekdayLabels[weekday]}</h4>
                        <p className={`text-xs ${day ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {day ? `${day.name} - ${day.exercises.length} exercises` : 'Blank - Click to add'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
              
              <Button onClick={handleFinishWeeklyAssignment} className="w-full" variant="default">
                Done
              </Button>
            </div>
          ) : isAssigningRotationalDays ? (
            <div className="space-y-4">
              {rotationalDaySlots.map((dayId, index) => {
                const day = dayId ? getDayById(dayId) : null;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleRotationalDayClick(index)}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-gray-100/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {day?.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: day.color }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">Day {index + 1}</h4>
                        <p className={`text-xs ${day ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {day ? `${day.name} - ${day.exercises.length} exercises` : 'Blank - Click to add'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
              
              <Button onClick={handleFinishRotationalAssignment} className="w-full" variant="default">
                Done
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}