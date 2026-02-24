import { useState, useEffect, useRef } from 'react';
import { AnimalType, MealCategory, SuggestionMode } from './types';
import { useProteinData } from './hooks/useProteinData';
import { getTodayKey } from './utils/dateUtils';
import { useTheme } from './hooks/useTheme';
import { useMealTimer } from './hooks/useMealTimer';
import { useNotifications } from './hooks/useNotifications';
import { useToast } from './hooks/useToast';
import { calculateMood } from './utils/moodCalculator';
import { getSettings, saveSettings, updateFavorites, getCheatDaysUsedThisWeek, toggleCheatDay, setStorageErrorHandler, shouldSuggestBackup, isOnboardingComplete } from './utils/storage';
import { Header } from './components/Header/Header';
import { AnimalAvatar } from './components/AnimalAvatar/AnimalAvatar';
import { CircularProgress } from './components/CircularProgress/CircularProgress';
import { MealTimer } from './components/MealTimer/MealTimer';
import { QuickAdd } from './components/QuickAdd/QuickAdd';
import { AddEntry } from './components/AddEntry/AddEntry';
import { ProteinLog } from './components/ProteinLog/ProteinLog';
import { Settings } from './components/Settings/Settings';
import { ToastContainer } from './components/Toast/Toast';
import { MacroDashboard } from './components/MacroDashboard/MacroDashboard';
import { RealityCheck } from './components/RealityCheck/RealityCheck';
import { StreakBadge } from './components/StreakBadge/StreakBadge';
import { AvatarMessage } from './components/AvatarMessage/AvatarMessage';
import { EatingWindow } from './components/EatingWindow/EatingWindow';
import { SuggestionToggle } from './components/SuggestionToggle/SuggestionToggle';
import { CheatDayToggle } from './components/CheatDayToggle/CheatDayToggle';
import { WeeklySummary } from './components/WeeklySummary/WeeklySummary';
import { useStreak } from './hooks/useStreak';
import { useXp } from './hooks/useXp';
import { useEatingWindow } from './hooks/useEatingWindow';
import { XpBadge } from './components/XpBadge/XpBadge';
import { Onboarding } from './components/Onboarding/Onboarding';
import { HistoryView } from './components/HistoryView/HistoryView';
import './App.css';

function getDefaultCategory(): MealCategory {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 14) return 'lunch';
  if (hour < 17) return 'snack';
  return 'dinner';
}

function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    dayData,
    totalProtein,
    totalCarbs,
    totalCalories,
    totalFiber,
    waterOz,
    progressPercent,
    addEntry,
    deleteEntry,
    restoreEntry,
    updateEntryTimestamp,
    setGoal,
    setMacroGoals,
    addWater,
  } = useProteinData();
  const { toasts, addToast, removeToast } = useToast();

  const [settings, setSettingsState] = useState(() => getSettings());
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>(settings.selectedAnimal);
  const [mealInterval, setMealInterval] = useState(settings.mealInterval);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>(getDefaultCategory);

  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingComplete());
  const [showHistory, setShowHistory] = useState(false);
  const [showTodaysLog, setShowTodaysLog] = useState(true);

  const [isCheatDay, setIsCheatDay] = useState(dayData.isCheatDay ?? false);
  const [cheatDaysUsed, setCheatDaysUsed] = useState(() => getCheatDaysUsedThisWeek());

  const { hoursSinceLastMeal, minutesUntilNextMeal, isOverdue, refresh: refreshTimer } = useMealTimer(mealInterval);
  const { permission, requestPermission, scheduleNotification } = useNotifications();

  const mood = calculateMood(progressPercent, hoursSinceLastMeal, mealInterval, isCheatDay);
  const { currentStreak, tier: streakTier, isNewTier } = useStreak(progressPercent);
  const { totalXp, level: xpLevel, isLevelUp } = useXp(progressPercent, dayData.entries.length, currentStreak);
  const eatingWindow = useEatingWindow(
    dayData.entries,
    totalProtein,
    dayData.goal,
    mealInterval,
    settings.eatingWindowStart,
    settings.eatingWindowEnd
  );

  // Storage error handler
  useEffect(() => {
    setStorageErrorHandler((error) => {
      if (error === 'quota_exceeded') {
        addToast('Storage is full! Export your data in Settings to free up space.', 'warning', 8000);
      } else if (error === 'write_failed') {
        addToast('Could not save data. Please try again.', 'warning', 5000);
      }
    });
  }, [addToast]);

  // Backup reminder
  useEffect(() => {
    if (shouldSuggestBackup()) {
      addToast('Back up your data! Export in Settings to keep it safe.', 'warning', 8000);
    }
  }, [addToast]);

  // Track progress for milestone toasts
  const prevPercentRef = useRef(progressPercent);
  useEffect(() => {
    const prev = prevPercentRef.current;
    prevPercentRef.current = progressPercent;

    if (prev < 50 && progressPercent >= 50 && progressPercent < 75) {
      addToast('50% — Halfway there! 💪', 'celebration', 4000);
    } else if (prev < 75 && progressPercent >= 75 && progressPercent < 100) {
      addToast('75% — Almost there! 🔥', 'celebration', 4000);
    } else if (prev < 100 && progressPercent >= 100) {
      addToast('100% — Goal reached! 🎉', 'celebration', 5000);
    }
  }, [progressPercent, addToast]);

  // Level-up toast
  useEffect(() => {
    if (isLevelUp) {
      addToast(`Level ${xpLevel}! New accessory unlocked! 🎉`, 'celebration', 5000);
    }
  }, [isLevelUp, xpLevel, addToast]);

  const handleAddEntry = (
    name: string,
    protein: number,
    category: MealCategory,
    macros?: { carbs: number; calories: number; fiber: number }
  ) => {
    addEntry(name, protein, category, macros);
    updateFavorites(name, protein, category, macros);
    refreshTimer();
    addToast(`Added ${protein}g protein!`, 'success', 3000);

    // Schedule reminder
    if (permission === 'granted') {
      const delayMs = mealInterval * 60 * 60 * 1000;
      scheduleNotification(
        'Time to eat!',
        `It's been ${mealInterval} hours since your last meal. Your protein pal is getting hungry!`,
        delayMs
      );
    }
  };

  const handleDeleteEntry = (id: string) => {
    const entry = dayData.entries.find((e) => e.id === id);
    deleteEntry(id);
    refreshTimer();

    if (entry) {
      addToast(`Removed ${entry.name}`, 'warning', 5000, {
        label: 'Undo',
        onClick: () => {
          restoreEntry(entry);
          refreshTimer();
        },
      });
    }
  };

  const handleQuickAdd = (name: string, protein: number, category: MealCategory, macros?: { carbs: number; calories: number; fiber: number }) => {
    handleAddEntry(name, protein, category, macros);
  };

  const handleAnimalChange = (animal: AnimalType) => {
    setSelectedAnimal(animal);
  };

  const handleMealIntervalChange = (hours: number) => {
    setMealInterval(hours);
  };

  const handleWindowStartChange = (minutesSinceMidnight: number) => {
    const updated = { ...settings, eatingWindowMode: 'fixed' as const, eatingWindowStart: minutesSinceMidnight };
    // If no end time override yet, default to start + 12 hours
    if (updated.eatingWindowEnd === undefined) {
      updated.eatingWindowEnd = (minutesSinceMidnight + 720) % 1440;
    }
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleWindowEndChange = (minutesSinceMidnight: number) => {
    const updated = { ...settings, eatingWindowMode: 'fixed' as const, eatingWindowEnd: minutesSinceMidnight };
    // If no start time override yet, default to end - 12 hours
    if (updated.eatingWindowStart === undefined) {
      updated.eatingWindowStart = (minutesSinceMidnight - 720 + 1440) % 1440;
    }
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleToggleCheatDay = () => {
    const todayKey = getTodayKey();
    const updated = toggleCheatDay(todayKey);
    setIsCheatDay(updated.isCheatDay ?? false);
    setCheatDaysUsed(getCheatDaysUsedThisWeek());
    if (updated.isCheatDay) {
      addToast('Cheat day activated! Enjoy your day off 😎', 'success', 3000);
    }
  };

  const handleAddWater = (oz: number) => {
    addWater(oz);
    addToast(`+${oz}oz water! 💧`, 'success', 2000);
  };

  const handleShowMacrosChange = (show: boolean) => {
    const updated = { ...settings, showMacros: show };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleShowWaterChange = (show: boolean) => {
    const updated = { ...settings, showWater: show };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleWaterGoalChange = (goalOz: number) => {
    const updated = { ...settings, waterGoalOz: goalOz };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleShowWeeklySummaryChange = (show: boolean) => {
    const updated = { ...settings, showWeeklySummary: show };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleSuggestionModeChange = (mode: SuggestionMode) => {
    const updated = { ...settings, suggestionMode: mode };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const remainingCheatDays = Math.max(0, settings.cheatDaysPerWeek - cheatDaysUsed + (isCheatDay ? 1 : 0));

  const handleWorkoutDaysChange = (days: number[]) => {
    setSettingsState((prev) => ({ ...prev, workoutDays: days }));
  };

  const handleCheatDaysPerWeekChange = (count: number) => {
    setSettingsState((prev) => ({ ...prev, cheatDaysPerWeek: count }));
  };

  const handleCloseSettings = () => {
    // Re-read settings from storage to fix potential desync
    const freshSettings = getSettings();
    setSelectedAnimal(freshSettings.selectedAnimal);
    setMealInterval(freshSettings.mealInterval);
    setSettingsState(freshSettings);
    setShowSettings(false);
  };

  return (
    <div className="app">
      <a href="#main-content" className="sr-only sr-only--focusable">Skip to main content</a>
      <Header
        onSettingsClick={() => setShowSettings(true)}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />
      <main className="app__main" id="main-content">
        <div className="app__badges">
          {currentStreak > 0 && (
            <StreakBadge currentStreak={currentStreak} tier={streakTier} isNewTier={isNewTier} />
          )}
          <XpBadge level={xpLevel} totalXp={totalXp} isLevelUp={isLevelUp} />
        </div>
        <MealTimer minutesUntilNext={minutesUntilNextMeal} isOverdue={isOverdue} />
        <div className="app__hero">
          <AnimalAvatar animal={selectedAnimal} mood={mood} streakTier={streakTier} level={xpLevel} />
          <AvatarMessage mood={mood} />
          <CheatDayToggle
            isCheatDay={isCheatDay}
            onToggle={handleToggleCheatDay}
            remainingCheatDays={remainingCheatDays}
          />
          <CircularProgress current={totalProtein} goal={dayData.goal} percent={progressPercent} />
        </div>
        <MacroDashboard
          totalCarbs={totalCarbs}
          totalCalories={totalCalories}
          totalFiber={totalFiber}
          carbGoal={settings.carbGoal}
          calorieGoal={settings.calorieGoal}
          fiberGoal={settings.fiberGoal}
          showMacros={settings.showMacros}
          showWater={settings.showWater}
          waterOz={waterOz}
          waterGoalOz={settings.waterGoalOz}
          onAddWater={handleAddWater}
          onToggleMacros={() => handleShowMacrosChange(!settings.showMacros)}
          onToggleWater={() => handleShowWaterChange(!settings.showWater)}
        />
        <QuickAdd
          onQuickAdd={handleQuickAdd}
          selectedCategory={selectedCategory}
          refreshKey={dayData.entries.length}
        />
        <AddEntry
          onAdd={handleAddEntry}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <RealityCheck totalProtein={totalProtein} dailyGoal={dayData.goal} />
        <EatingWindow
          windowStart={eatingWindow.windowStart}
          windowEnd={eatingWindow.windowEnd}
          mealTimestamps={eatingWindow.mealTimestamps}
          nextMealSuggestion={eatingWindow.nextMealSuggestion}
          totalProtein={totalProtein}
          dailyGoal={dayData.goal}
          hoursRemaining={eatingWindow.hoursRemaining}
          onWindowStartChange={handleWindowStartChange}
          onWindowEndChange={handleWindowEndChange}
        />
        <SuggestionToggle
          totalProtein={totalProtein}
          dailyGoal={dayData.goal}
          entries={dayData.entries}
          hoursRemaining={eatingWindow.hoursRemaining}
          mealInterval={mealInterval}
          onAddEntry={handleAddEntry}
          suggestionMode={settings.suggestionMode}
          onModeChange={handleSuggestionModeChange}
        />
        <WeeklySummary
          settings={settings}
          totalProtein={totalProtein}
          isCheatDay={isCheatDay}
          show={settings.showWeeklySummary}
          onToggle={() => handleShowWeeklySummaryChange(!settings.showWeeklySummary)}
        />
        <button
          className="app__history-toggle"
          onClick={() => setShowHistory(!showHistory)}
          data-testid="history-toggle"
        >
          {showHistory ? 'Hide History' : 'View History'}
        </button>
        {showHistory && <HistoryView />}
        <ProteinLog
          entries={dayData.entries}
          onDelete={handleDeleteEntry}
          onUpdateTimestamp={updateEntryTimestamp}
          show={showTodaysLog}
          onToggle={() => setShowTodaysLog(!showTodaysLog)}
        />
      </main>

      {showSettings && (
        <Settings
          selectedAnimal={selectedAnimal}
          onAnimalChange={handleAnimalChange}
          goal={dayData.goal}
          onGoalChange={setGoal}
          onClose={handleCloseSettings}
          darkMode={darkMode}
          onToggleDark={toggleDarkMode}
          notificationPermission={permission}
          onRequestNotifications={requestPermission}
          mealInterval={mealInterval}
          onMealIntervalChange={handleMealIntervalChange}
          macroGoals={dayData.macroGoals}
          onMacroGoalsChange={setMacroGoals}
          workoutDays={settings.workoutDays}
          onWorkoutDaysChange={handleWorkoutDaysChange}
          cheatDaysPerWeek={settings.cheatDaysPerWeek}
          onCheatDaysPerWeekChange={handleCheatDaysPerWeekChange}
          showMacros={settings.showMacros}
          onShowMacrosChange={handleShowMacrosChange}
          showWater={settings.showWater}
          onShowWaterChange={handleShowWaterChange}
          waterGoalOz={settings.waterGoalOz}
          onWaterGoalChange={handleWaterGoalChange}
          showWeeklySummary={settings.showWeeklySummary}
          onShowWeeklySummaryChange={handleShowWeeklySummaryChange}
          onImportComplete={(message, success) => {
            addToast(message, success ? 'success' : 'warning', 5000);
          }}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {showOnboarding && (
        <Onboarding onComplete={() => {
          setShowOnboarding(false);
          const fresh = getSettings();
          setSelectedAnimal(fresh.selectedAnimal);
          setGoal(fresh.dailyGoal);
          setSettingsState(fresh);
        }} />
      )}
    </div>
  );
}

export default App;
