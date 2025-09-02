# Jazz Guitar Tracker V2 - Complete Development Plan

This document provides comprehensive context for Claude Code to rebuild the Jazz Guitar Practice Tracker from scratch with modern architecture while maintaining all existing functionality.

## Project Context

### Current State Analysis
The existing V1 app (`/home/davidp/music/practice_app/jazz-guitar-tracker/`) is a fully functional React application with sophisticated features but has grown organically, resulting in:
- 1387-line App.jsx with complex state management
- Heavy prop drilling throughout component tree
- No TypeScript safety for complex data structures
- No testing framework
- Performance optimizations added reactively

### V2 Goals
- Maintain 100% feature parity with V1
- Modern TypeScript + React architecture
- Clean state management with Zustand
- Comprehensive testing from day one
- Improved performance and maintainability
- Seamless migration path for users

## Technology Stack

### Core Technologies
- **React 18** with functional components and hooks
- **TypeScript** for type safety on complex data models
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling with dark mode support
- **Zustand** for state management (simpler than Redux for this use case)

### Additional Libraries
- **Lucide React** for icons (same as V1)
- **date-fns** for date manipulation (better than custom date logic)
- **Recharts** for data visualization (replacing custom chart components)
- **React Hook Form** for complex forms (session setup, settings)
- **Vitest + React Testing Library** for testing

### Development Tools
- **ESLint + TypeScript ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **@testing-library/jest-dom** for enhanced testing assertions

## Core Data Models (TypeScript Interfaces)

Based on analysis of V1 data structures:

```typescript
// Standards with 8-step learning progression
interface Standard {
  id: string;
  name: string;
  steps: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]; // Exactly 8 steps
  completed: boolean;
  active: boolean;
  notes?: string;
  lastWorkedOn?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Other practice work (exercises, transcriptions, etc.)
interface OtherWork {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  active: boolean;
  notes?: string;
  lastWorkedOn?: string;
  createdAt: string;
  updatedAt: string;
}

// Practice session tasks
interface SessionTask {
  id: string;
  name: string;
  type: 'standard' | 'other_work' | 'one_off';
  timeAllocated: number; // minutes
  standardId?: string; // if type === 'standard'
  otherWorkId?: string; // if type === 'other_work'
  practiceNote?: string;
  sessionNote?: string;
  completed?: boolean;
}

// Complete practice sessions
interface PracticeSession {
  id: string;
  date: string; // ISO date string
  tasks: SessionTask[];
  totalTime: number; // minutes allocated
  completed: boolean;
  startTime?: string; // ISO datetime
  endTime?: string; // ISO datetime
  taskTimeSpent: Record<string, number>; // taskId -> seconds spent
  sessionNotes?: string;
}

// Timer state for active sessions
interface TimerState {
  activeTaskId: string | null;
  isRunning: boolean;
  sessionStartTime: number | null; // timestamp
  taskTimers: Record<string, {
    timeSpent: number; // seconds
    lastStartTime: number | null; // timestamp
  }>;
}

// Collections (teacher-assigned packages)
interface Collection {
  id: string;
  name: string;
  description?: string;
  type: 'assigned' | 'self_created';
  sessions: CollectionSession[];
  createdAt: string;
  updatedAt: string;
}

interface CollectionSession {
  id: string;
  name: string;
  description?: string;
  tasks: SessionTask[];
  dependencies?: string[]; // session IDs that must be completed first
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate?: string;
}

// Streak tracking settings and data
interface StreakSettings {
  enabled: boolean;
  daily: {
    enabled: boolean;
    goal: number; // target streak length
    graceDays: number; // 0-7
  };
  weekly: {
    enabled: boolean;
    daysPerWeek: number; // 1-7
    graceWeeks: number; // 0-4
  };
}

interface StreakData {
  dailyStreak: {
    current: number;
    longest: number;
    graceDaysUsed: number;
    lastPracticeDate?: string;
  };
  weeklyStreak: {
    current: number;
    longest: number;
    graceWeeksUsed: number;
    currentWeekDays: number;
    weekStart: string; // ISO date of Monday
  };
}

// Application settings
interface AppSettings {
  darkMode: boolean;
  streakSettings: StreakSettings;
  defaultSessionTime: number; // minutes
  standardTimeAllocation: number; // default minutes for standards
  otherWorkTimeAllocation: number; // default minutes for other work
}
```

## Zustand Store Architecture

Organize state into feature-based slices:

### Standards Slice
```typescript
interface StandardsSlice {
  standards: Standard[];
  
  // Actions
  addStandard: (name: string, notes?: string) => void;
  updateStandard: (id: string, updates: Partial<Standard>) => void;
  toggleStandardStep: (standardId: string, stepIndex: number) => void;
  toggleStandardActive: (standardId: string) => void;
  deleteStandard: (standardId: string) => void;
  
  // Computed values
  getActiveStandards: () => Standard[];
  getCompletedStandards: () => Standard[];
  getStandardById: (id: string) => Standard | undefined;
}
```

### Other Work Slice
```typescript
interface OtherWorkSlice {
  otherWork: OtherWork[];
  
  // Actions
  addOtherWork: (name: string, description?: string) => void;
  updateOtherWork: (id: string, updates: Partial<OtherWork>) => void;
  toggleOtherWorkActive: (id: string) => void;
  toggleOtherWorkCompleted: (id: string) => void;
  deleteOtherWork: (id: string) => void;
  
  // Computed values
  getActiveOtherWork: () => OtherWork[];
  getCompletedOtherWork: () => OtherWork[];
  getOtherWorkById: (id: string) => OtherWork | undefined;
}
```

### Practice Session Slice
```typescript
interface PracticeSessionSlice {
  practiceHistory: PracticeSession[];
  currentSession: PracticeSession | null;
  timerState: TimerState;
  
  // Session Management
  createSession: (tasks: SessionTask[]) => void;
  startSession: (session: PracticeSession) => void;
  endSession: () => { session: PracticeSession; taskTimeSpent: Record<string, number> } | null;
  cancelSession: () => void;
  
  // Timer Management
  selectTask: (taskId: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  
  // Task Management
  updateTask: (taskId: string, updates: Partial<SessionTask>) => void;
  completeTask: (taskId: string) => void;
  
  // Time Calculations
  getTaskTimeSpent: (taskId: string) => number;
  getSessionElapsedTime: () => number;
  getTaskRemainingTime: (taskId: string) => number;
  
  // History Management
  addCompletedSession: (session: PracticeSession) => void;
  getRecentSessions: (days: number) => PracticeSession[];
  getWeeklyStats: () => WeeklyStats;
}
```

### Settings Slice
```typescript
interface SettingsSlice {
  settings: AppSettings;
  
  // Actions
  toggleDarkMode: () => void;
  updateStreakSettings: (settings: Partial<StreakSettings>) => void;
  updateDefaultTimes: (standard: number, otherWork: number) => void;
  resetSettings: () => void;
}
```

### Collections Slice
```typescript
interface CollectionsSlice {
  collections: Collection[];
  
  // Actions
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  
  // Session Management
  addSessionToCollection: (collectionId: string, session: CollectionSession) => void;
  updateCollectionSession: (collectionId: string, sessionId: string, updates: Partial<CollectionSession>) => void;
  completeCollectionSession: (collectionId: string, sessionId: string) => void;
  
  // Computed Values
  getAvailableSessions: () => CollectionSession[];
  getLockedSessions: () => CollectionSession[];
  getCollectionProgress: (collectionId: string) => number; // percentage
}
```

## Component Architecture

### Core Layout Components
```
App.tsx
├── Header.tsx (title, dark mode toggle, main navigation)
├── Sidebar.tsx (navigation, quick stats)
└── Main.tsx
    ├── Overview.tsx (dashboard with stats and quick actions)
    ├── Standards/
    │   ├── StandardsList.tsx
    │   ├── StandardCard.tsx
    │   ├── AddStandardForm.tsx
    │   └── EditStandardForm.tsx
    ├── OtherWork/
    │   ├── OtherWorkList.tsx
    │   ├── OtherWorkCard.tsx
    │   ├── AddOtherWorkForm.tsx
    │   └── EditOtherWorkForm.tsx
    ├── Sessions/
    │   ├── SessionSetup.tsx
    │   ├── ActiveSession.tsx
    │   ├── Timer.tsx
    │   ├── TaskList.tsx
    │   └── SessionSummary.tsx
    ├── Reports/
    │   ├── ReportsView.tsx
    │   ├── PracticeCalendar.tsx
    │   ├── Charts/
    │   │   ├── WeeklyTrend.tsx
    │   │   ├── TaskDistribution.tsx
    │   │   └── ProgressBars.tsx
    │   └── TeacherReport.tsx
    ├── Collections/
    │   ├── CollectionsList.tsx
    │   ├── CollectionCard.tsx
    │   └── CollectionDetail.tsx
    └── Settings/
        ├── SettingsModal.tsx
        ├── StreakSettings.tsx
        └── ImportExport.tsx
```

### Shared Components
```
components/shared/
├── Button.tsx (typed variants for different use cases)
├── Modal.tsx (reusable modal wrapper)
├── LoadingSpinner.tsx
├── ConfirmDialog.tsx
├── FilterButtons.tsx
├── ProgressBar.tsx
├── TimeDisplay.tsx
├── DatePicker.tsx
└── FileUpload.tsx
```

## Key Features to Replicate from V1

### 1. Standards Management System
**8-Step Learning Algorithm:**
1. Play through with staple chords
2. Learn shell chords
3. Learn scales for each chord
4. Learn arpeggios for each chord
5. Target the 3rds
6. Comping
7. Practice improvisation
8. Post performance video

**Features:**
- Visual progress tracking with checkboxes
- Active/inactive status toggle
- Notes field for each standard
- Last worked on timestamp
- Filtering (active, completed, inactive, all)
- Collapsible sections for space management

### 2. Multi-Task Timer System
**Core Functionality:**
- Create practice sessions with multiple tasks
- Drag-and-drop task reordering (during setup)
- Time allocation per task (default: 25min standards, 20min other work)
- Task switching without losing time
- Overtime tracking when "in the zone"
- Pause/resume functionality
- Visual progress indicators

**Timer States:**
- Session not started
- Session active, no task selected
- Session active, task selected, timer paused
- Session active, task selected, timer running
- Session ended, summary mode

### 3. Practice Session Workflow
**Session Setup:**
- Select from active standards (auto-suggest based on last worked on)
- Select from active other work
- Add one-off tasks for the session
- Suggest repertoire review (completed standards needing maintenance)
- Time allocation with defaults and manual adjustment

**During Session:**
- Clear visual indication of active task
- One-click task switching
- Time remaining vs. time spent display
- Session progress indicator
- Notes field per task
- Session-level notes

**Session Completion:**
- Summary of time spent per task
- Step completion checkboxes for standards worked on
- Final notes for each task
- Overall session notes
- Save and return to dashboard

### 4. Data Management
**Persistence:**
- localStorage for all data
- Automatic save on any changes
- Data migration handling for schema updates
- Rich sample data for new users

**Import/Export:**
- Full backup/restore functionality
- JSON format for portability
- Loading states and error handling
- Performance optimization for large datasets

### 5. Analytics & Reporting
**Dashboard Stats:**
- Weekly practice summary (sessions, total time, average)
- Next repertoire suggestion
- Active task count
- Streak information (if enabled)

**Practice Calendar:**
- GitHub-style heat map
- 30-day view with intensity indicators
- Click to view session details

**Charts & Visualizations:**
- Task distribution pie chart
- Weekly trend line chart
- Standards progress overview
- Practice pattern analysis

### 6. Teacher Reporting System
**Comprehensive Reports:**
- Overview tab: key metrics and summary
- Standards Progress: detailed step-by-step tracking
- Practice Analysis: time distribution and patterns
- Recommendations: AI-generated suggestions

**PDF Export:**
- Professional formatting
- Print-optimized layouts
- All tabs included in export
- Automatic filename generation

### 7. Streak Tracking System
**Daily Streaks:**
- Consecutive practice days counter
- Configurable grace days (0-7)
- Goal setting with celebrations
- Longest streak tracking

**Weekly Streaks:**
- Days per week goal (1-7)
- Consecutive weeks meeting goal
- Grace weeks allowance
- Progress indicators

**Celebrations:**
- Modal with confetti animation
- Achievement messages
- Milestone tracking

### 8. Collections System
**Teacher-Assigned Packages:**
- Practice sessions with dependencies
- Series progression tracking
- Status management (pending, in-progress, completed)
- Import/export for sharing

**Dependency Management:**
- Sessions unlock based on completion
- Visual indication of locked/available sessions
- Progress tracking across series

### 9. Dark Mode & Responsive Design
**Theme System:**
- System preference detection
- Persistent user preference
- Smooth transitions between modes
- All components dark mode compatible

**Responsive Layout:**
- Mobile-first approach
- Touch-friendly interactions
- Collapsible sections for mobile
- Readable typography at all sizes

### 10. Data Models & Business Logic
**Constants to Replicate:**
```typescript
const STANDARD_STEPS = [
  'Play through with staple chords',
  'Learn shell chords', 
  'Learn scales for each chord',
  'Learn arpeggios for each chord',
  'Target the 3rds',
  'Comping',
  'Practice improv',
  'Post performance video'
];

const TASK_TYPES = {
  STANDARD: 'standard',
  OTHER_WORK: 'other_work', 
  ONE_OFF: 'one_off'
} as const;
```

**Sample Data Requirements:**
- 10+ realistic jazz standards at various completion levels
- 10+ other work items (etudes, transcriptions, exercises)
- 15+ practice session history with realistic time distributions
- Varied practice patterns to showcase analytics

## Development Phases

### Phase 1: Project Foundation (Days 1-3)
1. Create Vite + React + TypeScript project
2. Set up Tailwind CSS with dark mode configuration
3. Install and configure Zustand with persistence
4. Set up testing environment (Vitest + React Testing Library)
5. Create base TypeScript interfaces
6. Implement basic localStorage persistence layer
7. Set up sample data initialization

### Phase 2: Core Data Management (Days 4-6)
1. Implement Zustand store with all slices
2. Create standards management (CRUD operations)
3. Create other work management
4. Implement filtering and computed values
5. Add data migration utilities
6. Test data persistence and store operations

### Phase 3: Basic UI Framework (Days 7-9)
1. Create base layout components (App, Header, Sidebar, Main)
2. Implement routing structure
3. Build shared components (Button, Modal, etc.)
4. Create Standards and Other Work list views
5. Implement add/edit forms
6. Add dark mode toggle and theme persistence

### Phase 4: Timer & Session Management (Days 10-14)
1. Implement session creation flow
2. Build multi-task timer system
3. Create active session interface
4. Add task switching functionality
5. Implement session completion flow
6. Add session summary and history

### Phase 5: Analytics & Visualization (Days 15-17)
1. Create dashboard with key metrics
2. Implement practice calendar heat map
3. Build charts for data visualization
4. Add weekly/monthly statistics
5. Create progress tracking components

### Phase 6: Advanced Features (Days 18-21)
1. Implement teacher reporting system
2. Add PDF export functionality
3. Create streak tracking system
4. Build collections management
5. Add celebration system and achievements

### Phase 7: Polish & Testing (Days 22-25)
1. Comprehensive component testing
2. E2E testing for critical paths
3. Performance optimization
4. Accessibility improvements
5. Error boundary implementation
6. Loading states and error handling

### Phase 8: Migration & Documentation (Days 26-28)
1. Create V1 data import functionality
2. Build migration utilities
3. Write user documentation
4. Create developer documentation
5. Performance benchmarking
6. Final polish and bug fixes

## Testing Strategy

### Unit Tests
- All business logic functions (time calculations, streak logic)
- Store actions and computed values
- Utility functions (data migration, import/export)

### Component Tests
- Form submissions and validation
- Timer functionality
- Data display components
- Modal interactions

### Integration Tests
- Complete session workflows
- Data persistence across page refreshes
- Import/export functionality
- Theme switching

### E2E Tests
- Full practice session creation and completion
- Standards progression workflow
- Teacher report generation
- Data migration from V1

## Performance Considerations

### Bundle Size
- Lazy load routes and heavy components
- Tree shake unused libraries
- Optimize images and assets

### Runtime Performance
- Memoize expensive calculations
- Debounce timer updates
- Virtualize long lists if needed
- Optimize re-renders with proper React patterns

### Data Management
- Efficient data structures for time calculations
- Batch localStorage updates
- Implement proper error boundaries
- Handle edge cases gracefully

## Migration from V1

### Data Compatibility
- V2 must be able to import V1 localStorage data
- Implement migration functions for any schema changes
- Preserve all user data during transition

### Feature Parity Checklist
Before launching V2, ensure every V1 feature is replicated:
- [ ] All 8 standard steps tracking
- [ ] Multi-task timer with task switching
- [ ] Session creation and management
- [ ] Import/export functionality
- [ ] Teacher reporting with PDF export
- [ ] Streak tracking with celebrations
- [ ] Collections system
- [ ] Dark mode
- [ ] All chart types and analytics
- [ ] Sample data initialization

### User Transition
- Provide clear migration instructions
- Maintain V1 availability during transition period
- Create comparison guide highlighting improvements

## Success Metrics

### Code Quality
- 100% TypeScript coverage
- 80%+ test coverage
- Zero ESLint errors
- All components properly typed

### Performance
- < 2 second initial load time
- < 100ms interaction response time
- < 50MB bundle size
- Lighthouse score > 90

### Feature Completeness  
- All V1 features implemented
- Successful migration of V1 data
- User feedback confirms improved experience
- No regression bugs

## Additional Context for Claude

When implementing this plan:

1. **Reference the V1 app constantly** - it's the source of truth for user experience
2. **Start simple and build incrementally** - get basic functionality working before adding complexity
3. **Test early and often** - don't wait until the end to start testing
4. **Focus on TypeScript safety** - the complex data structures are where bugs hide
5. **Prioritize the timer system** - it's the most complex part and core to the user experience
6. **Keep performance in mind** - the timer updates frequently and needs to be smooth
7. **Don't over-engineer** - this is still a single-user app, keep solutions proportional

The goal is a cleaner, more maintainable version of the exact same app the user already loves.