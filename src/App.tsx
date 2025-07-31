import { useTodos } from './hooks/useTodos';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import StatsCards from './components/StatsCards';
import Charts from './components/Charts';
import TimeAnalytics from './components/TimeAnalytics';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const {
    todos,
    darkMode,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    toggleDarkMode,
    getStats,
    getPriorityStats,
    getCompletionTrend,
    getTimeAnalytics,
    clearAllData,
    exportData,
    importData,
    runCleanup,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 theme-optimized gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Stats Cards - Full width at top */}
        <div className="mb-6">
          <StatsCards stats={getStats()} />
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Todo Input and List */}
          <div className="col-span-12 xl:col-span-4 space-y-6">
            <TodoInput onAddTodo={addTodo} />
            <TodoList
              todos={todos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
            />
          </div>
          
          {/* Right Column - Charts and Analytics */}
          <div className="col-span-12 xl:col-span-8 space-y-6">
            <Charts 
              priorityStats={getPriorityStats()} 
              completionTrend={getCompletionTrend()} 
            />
            <TimeAnalytics data={getTimeAnalytics()} />
          </div>
        </div>
        
        <SettingsPanel
          onClearData={clearAllData}
          onExportData={exportData}
          onImportData={importData}
          onRunCleanup={runCleanup}
        />
      </div>
    </div>
  );
}

export default App;
