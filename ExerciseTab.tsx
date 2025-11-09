import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Dumbbell, Tag, X, Plus, Check, ChevronUp, ChevronDown, ArrowRight, Trash2 } from 'lucide-react';
import { ExerciseInLibrary, WorkoutDayInLibrary, Split, Exercise } from '../App';

interface ExerciseTabProps {
  exerciseLibrary: ExerciseInLibrary[];
  setExerciseLibrary: React.Dispatch<React.SetStateAction<ExerciseInLibrary[]>>;
  dayLibrary: WorkoutDayInLibrary[];
  setDayLibrary: React.Dispatch<React.SetStateAction<WorkoutDayInLibrary[]>>;
  splits: Split[];
  setSplits: React.Dispatch<React.SetStateAction<Split[]>>;
  activeSplitId: string | null;
  setActiveSplitId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ExerciseTab({ 
  exerciseLibrary, 
  setExerciseLibrary,
  dayLibrary,
  setDayLibrary,
  splits,
  setSplits,
  activeSplitId,
  setActiveSplitId
}: ExerciseTabProps) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInLibrary | null>(null);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<WorkoutDayInLibrary | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [daySearchQuery, setDaySearchQuery] = useState('');
  const [showNewSplitDialog, setShowNewSplitDialog] = useState(false);
  const [newSplitName, setNewSplitName] = useState('');
  const [newSplitType, setNewSplitType] = useState<'rotational' | 'weekly'>('rotational');
  const [rotationalDayCount, setRotationalDayCount] = useState(3);
  const [selectedDaysForSplit, setSelectedDaysForSplit] = useState<string[]>([]);
  const [selectedWeeklyDays, setSelectedWeeklyDays] = useState<{[key: string]: string}>({});
  
  // Edit mode states
  const [isEditingDay, setIsEditingDay] = useState(false);
  const [editingDayData, setEditingDayData] = useState<{ name: string; exercises: Exercise[]; color?: string }>({ name: '', exercises: [] });
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    warmupSets: 0,
    warmupReps: 0,
    workingSets: 3,
    workingReps: 10
  });
  
  // Split editing states
  const [selectedSplit, setSelectedSplit] = useState<Split | null>(null);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [isEditingSplit, setIsEditingSplit] = useState(false);
  const [editingSplitName, setEditingSplitName] = useState('');
  const [editingSplitDays, setEditingSplitDays] = useState<string[]>([]);
  const [editingSplitWeeklyDays, setEditingSplitWeeklyDays] = useState<{[key: string]: string}>({});

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

  const colorOptions = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#06b6d4', // cyan
  ];

  // Filter exercises by search query
  const filteredExercises = exerciseLibrary.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter days by search query
  const filteredDays = dayLibrary.filter(day =>
    day.name.toLowerCase().includes(daySearchQuery.toLowerCase())
  );

  // Get day by ID
  const getDayById = (id: string) => dayLibrary.find(d => d.id === id);

  const handleExerciseClick = (exercise: ExerciseInLibrary) => {
    setSelectedExercise(exercise);
    setShowExerciseDialog(true);
  };

  const handleDayClick = (day: WorkoutDayInLibrary) => {
    setSelectedDay(day);
    setEditingDayData({
      name: day.name,
      exercises: [...day.exercises],
      color: day.color
    });
    setIsEditingDay(true);
    setShowDayDialog(true);
  };

  const handleSplitClick = (split: Split) => {
    setSelectedSplit(split);
    setEditingSplitName(split.name);
    if (split.routine?.type === 'rotational') {
      setEditingSplitDays(split.routine.dayIds);
      setEditingSplitWeeklyDays({});
    } else if (split.routine?.type === 'weekly') {
      setEditingSplitDays([]);
      setEditingSplitWeeklyDays(split.routine.days);
    }
    setIsEditingSplit(true);
    setShowSplitDialog(true);
  };

  const handleCreateSplit = () => {
    if (!newSplitName.trim()) return;

    const newId = `split-${Date.now()}`;
    let newRoutine;

    if (newSplitType === 'rotational') {
      // Use selected days for rotational split
      newRoutine = {
        type: 'rotational' as const,
        dayIds: selectedDaysForSplit
      };

      // Update usedInSplits for each selected day
      setDayLibrary(dayLibrary.map(day => {
        if (selectedDaysForSplit.includes(day.id)) {
          return {
            ...day,
            usedInSplits: [...day.usedInSplits, { splitId: newId, splitName: newSplitName }]
          };
        }
        return day;
      }));
    } else {
      // Use selected weekly days
      newRoutine = {
        type: 'weekly' as const,
        days: selectedWeeklyDays
      };

      // Update usedInSplits for each selected day
      const dayIds = Object.values(selectedWeeklyDays);
      setDayLibrary(dayLibrary.map(day => {
        if (dayIds.includes(day.id)) {
          return {
            ...day,
            usedInSplits: [...day.usedInSplits, { splitId: newId, splitName: newSplitName }]
          };
        }
        return day;
      }));
    }

    const newSplit: Split = {
      id: newId,
      name: newSplitName,
      routine: newRoutine
    };

    setSplits([...splits, newSplit]);
    setActiveSplitId(newId);
    setNewSplitName('');
    setSelectedDaysForSplit([]);
    setSelectedWeeklyDays({});
    setShowNewSplitDialog(false);
  };

  const toggleDaySelection = (dayId: string) => {
    if (selectedDaysForSplit.includes(dayId)) {
      setSelectedDaysForSplit(selectedDaysForSplit.filter(id => id !== dayId));
    } else {
      setSelectedDaysForSplit([...selectedDaysForSplit, dayId]);
    }
  };

  const toggleWeeklyDaySelection = (weekday: string, dayId: string) => {
    const newSelection = { ...selectedWeeklyDays };
    if (newSelection[weekday] === dayId) {
      delete newSelection[weekday];
    } else {
      newSelection[weekday] = dayId;
    }
    setSelectedWeeklyDays(newSelection);
  };

  const toggleEditingSplitDay = (dayId: string) => {
    if (editingSplitDays.includes(dayId)) {
      setEditingSplitDays(editingSplitDays.filter(id => id !== dayId));
    } else {
      setEditingSplitDays([...editingSplitDays, dayId]);
    }
  };

  const toggleEditingSplitWeeklyDay = (weekday: string, dayId: string) => {
    const newSelection = { ...editingSplitWeeklyDays };
    if (newSelection[weekday] === dayId) {
      delete newSelection[weekday];
    } else {
      newSelection[weekday] = dayId;
    }
    setEditingSplitWeeklyDays(newSelection);
  };

  const handleSaveDay = () => {
    if (!selectedDay || !editingDayData.name.trim()) return;

    setDayLibrary(dayLibrary.map(day => {
      if (day.id === selectedDay.id) {
        return {
          ...day,
          name: editingDayData.name,
          exercises: editingDayData.exercises,
          color: editingDayData.color
        };
      }
      return day;
    }));

    // Update exercises in exercise library
    editingDayData.exercises.forEach(exercise => {
      const existingExercise = exerciseLibrary.find(e => e.name.toLowerCase() === exercise.name.toLowerCase());
      if (!existingExercise) {
        const newExerciseId = `exercise-${Date.now()}-${Math.random()}`;
        const newLibraryExercise: ExerciseInLibrary = {
          ...exercise,
          id: newExerciseId,
          usedInDays: [selectedDay.id]
        };
        setExerciseLibrary(prev => [...prev, newLibraryExercise]);
      } else {
        if (!existingExercise.usedInDays.includes(selectedDay.id)) {
          setExerciseLibrary(prev => prev.map(e => 
            e.id === existingExercise.id 
              ? { ...e, usedInDays: [...e.usedInDays, selectedDay.id] }
              : e
          ));
        }
      }
    });

    setShowDayDialog(false);
    setIsEditingDay(false);
    setSelectedDay(null);
    setEditingDayData({ name: '', exercises: [] });
  };

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return;

    setEditingDayData({
      ...editingDayData,
      exercises: [...editingDayData.exercises, { ...newExercise }]
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
    setEditingDayData({
      ...editingDayData,
      exercises: editingDayData.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSaveSplit = () => {
    if (!selectedSplit || !editingSplitName.trim()) return;

    setSplits(splits.map(split => {
      if (split.id === selectedSplit.id) {
        if (split.routine?.type === 'rotational') {
          return {
            ...split,
            name: editingSplitName,
            routine: {
              ...split.routine,
              dayIds: editingSplitDays
            }
          };
        } else if (split.routine?.type === 'weekly') {
          return {
            ...split,
            name: editingSplitName,
            routine: {
              ...split.routine,
              days: editingSplitWeeklyDays
            }
          };
        }
      }
      return split;
    }));

    setShowSplitDialog(false);
    setIsEditingSplit(false);
    setSelectedSplit(null);
    setEditingSplitName('');
    setEditingSplitDays([]);
    setEditingSplitWeeklyDays({});
  };

  const handleDeleteSplit = () => {
    if (!selectedSplit) return;
    
    if (confirm(`Are you sure you want to delete "${selectedSplit.name}"?`)) {
      setSplits(splits.filter(s => s.id !== selectedSplit.id));
      
      // Update dayLibrary to remove this split from usedInSplits
      setDayLibrary(dayLibrary.map(day => ({
        ...day,
        usedInSplits: day.usedInSplits.filter(s => s.splitId !== selectedSplit.id)
      })));
      
      if (activeSplitId === selectedSplit.id) {
        setActiveSplitId(splits.length > 1 ? splits[0].id : null);
      }
      
      setShowSplitDialog(false);
      setIsEditingSplit(false);
      setSelectedSplit(null);
    }
  };

  // Get exercise stats
  const getExerciseStats = (exercise: ExerciseInLibrary) => {
    const daysUsedIn = exercise.usedInDays.length;
    return { daysUsedIn };
  };

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      {/* Header with Active Split */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {splits.find(s => s.id === activeSplitId)?.name || 'No Active Split'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {dayLibrary.length} days • {exerciseLibrary.length} exercises
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Days and Exercises */}
      <Tabs defaultValue="days" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="days">Days</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>

        {/* Days Tab */}
        <TabsContent value="days" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Day Library</CardTitle>
                <Badge variant="secondary">{dayLibrary.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search days..."
                value={daySearchQuery}
                onChange={(e) => setDaySearchQuery(e.target.value)}
                className="w-full"
              />

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredDays.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {daySearchQuery ? 'No days found' : 'No days created yet'}
                    </p>
                    <p className="text-xs mt-1">
                      Create a split in the Calendar tab to add workout days
                    </p>
                  </div>
                ) : (
                  filteredDays.map((day) => (
                    <div
                      key={day.id}
                      onClick={() => handleDayClick(day)}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {day.color && (
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: day.color }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{day.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {day.exercises.length} exercises
                            {day.usedInSplits.length > 0 && ` • Used in ${day.usedInSplits.length} split${day.usedInSplits.length > 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manage Splits */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Your Splits</CardTitle>
                <Badge variant="secondary">{splits.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {splits.map((split) => (
                  <div key={split.id} className="flex items-center gap-2">
                    <div
                      onClick={() => setActiveSplitId(split.id)}
                      className={`flex-1 flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        activeSplitId === split.id
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div>
                        <h4 className={`font-medium ${activeSplitId === split.id ? 'text-white' : ''}`}>
                          {split.name}
                        </h4>
                        <p className={`text-xs ${
                          activeSplitId === split.id 
                            ? 'text-white/80' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {split.routine?.type === 'rotational' 
                            ? `${split.routine.dayIds.length} day rotational`
                            : 'Weekly split'}
                        </p>
                      </div>
                      {activeSplitId === split.id && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSplitClick(split)}
                      className="h-auto px-3 py-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Exercise Library</CardTitle>
                <Badge variant="secondary">{exerciseLibrary.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchQuery ? 'No exercises found' : 'No exercises added yet'}
                    </p>
                    <p className="text-xs mt-1">
                      Add exercises to your workout days to build your library
                    </p>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => {
                    const stats = getExerciseStats(exercise);
                    return (
                      <div
                        key={exercise.id}
                        onClick={() => handleExerciseClick(exercise)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{exercise.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {exercise.workingSets} × {exercise.workingReps}
                            {stats.daysUsedIn > 0 && ` • Used in ${stats.daysUsedIn} day${stats.daysUsedIn > 1 ? 's' : ''}`}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exercise Detail Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>Exercise details and usage</DialogDescription>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Working Sets</Label>
                  <p className="font-medium">{selectedExercise.workingSets}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Working Reps</Label>
                  <p className="font-medium">{selectedExercise.workingReps}</p>
                </div>
                {selectedExercise.warmupSets > 0 && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Warm-up Sets</Label>
                      <p className="font-medium">{selectedExercise.warmupSets}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Warm-up Reps</Label>
                      <p className="font-medium">{selectedExercise.warmupReps}</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Used in Days</Label>
                <div className="space-y-2">
                  {selectedExercise.usedInDays.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Not used in any days</p>
                  ) : (
                    selectedExercise.usedInDays.map(dayId => {
                      const day = getDayById(dayId);
                      return day ? (
                        <div key={dayId} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          {day.color && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: day.color }}
                            />
                          )}
                          <span className="text-sm">{day.name}</span>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Day Edit Dialog */}
      <Dialog open={showDayDialog} onOpenChange={(open) => {
        if (!open) {
          setShowDayDialog(false);
          setIsEditingDay(false);
          setSelectedDay(null);
          setEditingDayData({ name: '', exercises: [] });
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingDayData.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: editingDayData.color }}
                />
              )}
              Edit Workout Day
            </DialogTitle>
            <DialogDescription>Modify workout details and exercises</DialogDescription>
          </DialogHeader>
          {isEditingDay && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Workout Name</Label>
                <Input
                  value={editingDayData.name}
                  onChange={(e) => setEditingDayData({ ...editingDayData, name: e.target.value })}
                  placeholder="e.g., Push Day, Leg Day, etc."
                />
              </div>

              <div>
                <Label className="block mb-2">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setEditingDayData({ ...editingDayData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        editingDayData.color === color 
                          ? 'border-gray-900 dark:border-white scale-110' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {editingDayData.exercises.length > 0 && (
                <div>
                  <Label className="block mb-2">Exercises</Label>
                  <div className="space-y-2">
                    {editingDayData.exercises.map((exercise, idx) => (
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
                onClick={handleSaveDay} 
                className="w-full" 
                disabled={!editingDayData.name.trim()}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Split Dialog */}
      <Dialog open={showNewSplitDialog} onOpenChange={setShowNewSplitDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Split</DialogTitle>
            <DialogDescription>
              Select existing days from your library to create a new split
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
                  onClick={() => {
                    setNewSplitType('rotational');
                    setSelectedWeeklyDays({});
                  }}
                  className="w-full"
                >
                  Rotational
                </Button>
                <Button
                  variant={newSplitType === 'weekly' ? 'default' : 'outline'}
                  onClick={() => {
                    setNewSplitType('weekly');
                    setSelectedDaysForSplit([]);
                  }}
                  className="w-full"
                >
                  Weekly
                </Button>
              </div>
            </div>

            {newSplitType === 'rotational' ? (
              <div>
                <Label className="block mb-2">Select Days (in order)</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dayLibrary.filter(d => !d.isRestDay).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No workout days available. Create days in the Calendar tab first.
                    </p>
                  ) : (
                    dayLibrary.filter(d => !d.isRestDay).map((day) => {
                      const isSelected = selectedDaysForSplit.includes(day.id);
                      const selectedIndex = selectedDaysForSplit.indexOf(day.id);
                      return (
                        <div
                          key={day.id}
                          onClick={() => toggleDaySelection(day.id)}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                {selectedIndex + 1}
                              </Badge>
                            )}
                            {day.color && !isSelected && (
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: day.color }}
                              />
                            )}
                            <span className="text-sm">{day.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Label className="block mb-2">Assign Days to Weekdays</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {weekdays.map(weekday => (
                    <div key={weekday} className="space-y-1">
                      <Label className="text-xs text-gray-500 dark:text-gray-400">{weekdayLabels[weekday]}</Label>
                      <div className="grid grid-cols-2 gap-1">
                        {dayLibrary.slice(0, 6).map(day => {
                          const isSelected = selectedWeeklyDays[weekday] === day.id;
                          return (
                            <Button
                              key={day.id}
                              size="sm"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() => toggleWeeklyDaySelection(weekday, day.id)}
                              className="text-xs h-8 justify-start"
                            >
                              {day.color && (
                                <div
                                  className="w-2 h-2 rounded-full mr-1"
                                  style={{ backgroundColor: day.color }}
                                />
                              )}
                              <span className="truncate">{day.name.slice(0, 10)}</span>
                              {isSelected && <Check className="w-3 h-3 ml-auto" />}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleCreateSplit} 
              className="w-full" 
              disabled={
                !newSplitName.trim() || 
                (newSplitType === 'rotational' && selectedDaysForSplit.length === 0) ||
                (newSplitType === 'weekly' && Object.keys(selectedWeeklyDays).length === 0)
              }
            >
              Create Split
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Split Dialog */}
      <Dialog open={showSplitDialog} onOpenChange={(open) => {
        if (!open) {
          setShowSplitDialog(false);
          setIsEditingSplit(false);
          setSelectedSplit(null);
          setEditingSplitName('');
          setEditingSplitDays([]);
          setEditingSplitWeeklyDays({});
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Split</DialogTitle>
            <DialogDescription>
              Modify split details and assigned days
            </DialogDescription>
          </DialogHeader>
          {isEditingSplit && selectedSplit && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Split Name</Label>
                <Input
                  value={editingSplitName}
                  onChange={(e) => setEditingSplitName(e.target.value)}
                  placeholder="e.g., Push Pull Legs, Upper Lower, etc."
                />
              </div>

              {selectedSplit.routine?.type === 'rotational' ? (
                <div>
                  <Label className="block mb-2">Select Days (in order)</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dayLibrary.filter(d => !d.isRestDay).length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No workout days available. Create days in the Calendar tab first.
                      </p>
                    ) : (
                      dayLibrary.filter(d => !d.isRestDay).map((day) => {
                        const isSelected = editingSplitDays.includes(day.id);
                        const selectedIndex = editingSplitDays.indexOf(day.id);
                        return (
                          <div
                            key={day.id}
                            onClick={() => toggleEditingSplitDay(day.id)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                  {selectedIndex + 1}
                                </Badge>
                              )}
                              {day.color && !isSelected && (
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: day.color }}
                                />
                              )}
                              <span className="text-sm">{day.name}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="block mb-2">Assign Days to Weekdays</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {weekdays.map(weekday => (
                      <div key={weekday} className="space-y-1">
                        <Label className="text-xs text-gray-500 dark:text-gray-400">{weekdayLabels[weekday]}</Label>
                        <div className="grid grid-cols-2 gap-1">
                          {dayLibrary.slice(0, 6).map(day => {
                            const isSelected = editingSplitWeeklyDays[weekday] === day.id;
                            return (
                              <Button
                                key={day.id}
                                size="sm"
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => toggleEditingSplitWeeklyDay(weekday, day.id)}
                                className="text-xs h-8 justify-start"
                              >
                                {day.color && (
                                  <div
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: day.color }}
                                  />
                                )}
                                <span className="truncate">{day.name.slice(0, 10)}</span>
                                {isSelected && <Check className="w-3 h-3 ml-auto" />}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveSplit} 
                  className="flex-1" 
                  disabled={!editingSplitName.trim()}
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={handleDeleteSplit} 
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
