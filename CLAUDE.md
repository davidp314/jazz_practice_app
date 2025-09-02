# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run these commands for development workflows:

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a **Jazz Guitar Practice Tracker** - a single-page React application for managing jazz guitar learning and practice sessions.

### Core Architecture
- **Frontend**: React 19.1 with functional components and hooks
- **Styling**: Tailwind CSS with dark mode support
- **Build Tool**: Vite 7.0 
- **Storage**: Browser localStorage (no backend required)
- **State Management**: React hooks and context patterns

### Key Application Concepts

**Jazz Standards Learning System**: The app implements an 8-step learning algorithm for jazz standards:
1. Play through with staple chords
2. Learn shell chords  
3. Learn scales for each chord
4. Learn arpeggios for each chord
5. Target the 3rds
6. Comping
7. Practice improvisation
8. Post performance video

**Practice Session Management**: 
- Session setup with drag-and-drop task organization
- Multi-task timer system with task switching
- Flexible time tracking with overtime support
- Session completion with progress updates

**Data Models**:
- **Standards**: Progress through 8 steps, active/inactive status
- **Other Work**: Technical exercises, transcriptions, etudes  
- **Practice Sessions**: Time-tracked sessions with task breakdowns
- **Collections**: Teacher-assigned practice packages with dependencies

### Directory Structure

```
src/
├── components/           # React components
│   ├── charts/          # Data visualization components
│   ├── PracticeSession.jsx    # Active practice session
│   ├── SessionSetup.jsx       # Session planning
│   ├── StandardCard.jsx       # Jazz standard display
│   ├── TeacherReport.jsx      # Teacher reporting system
│   └── ReportsView.jsx        # Analytics and reports
├── hooks/               # Custom React hooks
│   ├── usePracticeSession.js  # Session state management
│   ├── useCollections.js      # Collections management  
│   └── useStreak.js          # Practice streak tracking
├── utils/              # Utility functions
│   ├── importExport.js       # Data backup/restore
│   ├── stats.js             # Analytics calculations
│   ├── chartData.js         # Chart data processing
│   ├── pdfExport.js         # PDF generation
│   └── reportGenerator.js   # HTML report generation
├── constants.js        # Application constants
└── App.jsx            # Main application component
```

### Key Implementation Details

**State Management**: Uses useState and useEffect hooks extensively. Main state is in App.jsx with prop drilling to child components.

**Data Persistence**: All data stored in localStorage with automatic save on state changes. Includes data migration handling for schema updates.

**Timer System**: Complex multi-task timer in `usePracticeSession.js` hook that tracks time per task while allowing seamless task switching.

**Dark Mode**: Implemented with Tailwind classes and localStorage persistence, applied to document body.

**Sample Data**: Rich sample data is initialized if localStorage is empty, providing realistic practice history and standards.

**Collections System**: Teacher-assigned practice packages with dependency management and series progression tracking.

### Important Code Patterns

**Data Migration**: Standards data migration handles adding new steps (like "comping" step added as index 5).

**Filter System**: Both standards and other work have active/completed/inactive filters with consistent UI patterns.

**Modal Management**: Multiple modal states managed with boolean flags and conditional rendering.

**Import/Export**: Full data backup/restore with JSON format, including loading states and error handling.

### Recent Performance Improvements

**Async Import Processing**: Import functionality uses async/await with batch processing to prevent UI blocking. Large datasets are processed in smaller batches with UI thread yielding between operations.

**Loading States**: Import buttons show loading spinners and disable during operations. Performance monitoring logs import duration to console.

### Advanced Features

**PDF Export**: TeacherReport component includes comprehensive PDF export using browser print dialog. Print-optimized CSS ensures professional formatting across all report sections.

**Streak Counter**: Optional practice streak tracking with daily/weekly goals, grace periods, and celebration modals. Configurable through Settings modal with localStorage persistence.

**Collections System**: Teacher-assigned practice packages with dependency management, series progression, and collection import/export functionality.

### Documentation

Additional documentation exists in:
- `doc/manual.html` - Complete user manual (HTML format)
- `doc/organization.html` - System structure documentation (HTML format)
- `IMPORT_PERFORMANCE_IMPROVEMENTS.md` - Detailed import optimization documentation
- `PDF_EXPORT_FEATURE.md` - PDF export implementation guide
- `STREAK_FEATURE.md` - Streak counter usage and implementation

## Testing and Quality

No test framework is currently configured. The application relies on:
- ESLint for code quality (configured in eslint.config.js)
- Manual testing via development server
- Sample data for consistent testing scenarios
- Performance monitoring through console logging (especially for import operations)

Before making changes, always run `npm run lint` to ensure code quality standards are met.