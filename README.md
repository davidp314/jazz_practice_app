# Jazz Guitar Practice Tracker

A sophisticated web-based practice management system specifically designed for jazz guitarists who want to approach their learning systematically and track their progress over time.

## 🎵 Overview

Unlike generic practice apps, this tool understands the unique challenges of jazz education and provides features that align with proven jazz pedagogy. Learning jazz guitar involves simultaneously developing multiple skills:

- **Harmonic Knowledge**: Understanding complex chord progressions and substitutions
- **Technical Skills**: Mastering fingerings, scales, arpeggios, and voice leading  
- **Improvisational Abilities**: Creating melodic lines and developing jazz vocabulary
- **Repertoire Management**: Learning and maintaining dozens of standards

This application addresses these challenges with a structured, step-by-step approach while maintaining the flexibility that creative practice requires.

## ✨ Key Features

### 🎯 Systematic Standard Learning
- **8-step proven algorithm** for mastering jazz standards
- Progress tracking with visual indicators
- Active/inactive status management for focus control
- Customizable learning steps for different skill levels

### ⏱️ Intelligent Practice Sessions
- Drag-and-drop session planning
- Flexible timer system with task switching
- Overtime tracking for when you're "in the zone"
- Smart repertoire rotation suggestions
- Session notes and reflections

### 📊 Comprehensive Analytics
- Weekly and monthly practice statistics
- Detailed session history with time breakdowns
- Progress visualization across all standards
- Repertoire maintenance scheduling

### 🎨 Modern User Experience
- Dark mode support for evening practice
- Responsive design for desktop and mobile
- Intuitive interface with keyboard shortcuts
- Data export/import for backup and portability

### 📚 Collections & Series
- Teacher-assigned practice packages
- Multi-session curricula with dependencies
- Progress tracking across series
- Community-shared practice sequences

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or account creation required

### Quick Start
1. **Launch the Application**: Open the app in any modern web browser
2. **Choose Your Theme**: Click the sun/moon icon to toggle between light and dark modes
3. **Add Your First Standards**: 
   - Click "Add Standard" in the Jazz Standards section
   - Enter the name of a jazz standard you're working on (e.g., "Autumn Leaves")
   - The system will create a new standard with all 8 learning steps unchecked
4. **Add Other Practice Work**:
   - Click "Add Other Work" to include technical exercises, etudes, or transcription work
   - Enter a name and optional description

## 📖 The 8-Step Learning Algorithm

Each jazz standard follows a proven learning progression:

1. **Play through with staple chords** - Get familiar with the basic progression
2. **Learn shell chords** - Master essential voice leading
3. **Learn scales for each chord** - Understand harmonic choices
4. **Learn arpeggios for each chord** - Build melodic vocabulary
5. **Target the 3rds** - Develop smooth voice leading
6. **Comping** - Practice rhythm guitar and accompaniment
7. **Practice improvisation** - Apply your knowledge creatively
8. **Post performance video** - Document your achievement

## 🎯 Practice Session Workflow

### Session Setup
1. **Start a New Session**: Click "Start Session" from the overview page
2. **Add Standards to Practice**: Select from your active standards (default 25-minute allocation)
3. **Include Other Work**: Choose from your active other work items (default 20 minutes)
4. **Add One-Off Tasks**: Create custom tasks for today's session only
5. **Repertoire Review**: The app suggests completed standards that need review
6. **Organize Your Session**: Drag and drop tasks to reorder, adjust time allocations

### During Practice
- **Smart Task Switching**: Click any task to switch focus instantly
- **Flexible Overtime**: Continue working beyond allocated time when inspired
- **Keyboard Navigation**: Use arrow keys to switch tasks, spacebar for play/pause
- **Session Notes**: Record discoveries and breakthroughs during practice

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with Hooks
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.525.0
- **Build Tool**: Vite 7.0.0
- **Storage**: Local browser storage (no server required)
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
jazz-guitar-tracker/
├── src/
│   ├── components/          # React components
│   │   ├── PracticeSession.jsx
│   │   ├── SessionSetup.jsx
│   │   ├── StandardCard.jsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── usePracticeSession.js
│   │   └── useCollections.js
│   ├── utils/              # Utility functions
│   │   ├── importExport.js
│   │   └── stats.js
│   ├── constants.js        # Application constants
│   └── App.jsx            # Main application component
├── doc/                   # Documentation
│   ├── manual.html        # Complete user manual
│   └── organization.html  # System architecture
├── demo_files/           # Sample data and examples
└── public/              # Static assets
```

## 🔧 Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Key Features Implementation
- **Timer System**: Multi-task time memory with smart task switching
- **Data Persistence**: localStorage with automatic migration handling
- **Collections**: Teacher-assigned packages with dependency tracking
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 📊 Data Management

### Backup and Restore
- **Export Data**: Download complete backup file (JSON format)
- **Import Data**: Restore from backup file with automatic migration
- **Data Migration**: Handles format updates automatically
- **Version Compatibility**: Backward compatibility maintained

### Data Models
- **Standards**: 8-step progress tracking with notes and status
- **Other Work**: Custom practice items with descriptions
- **Practice Sessions**: Time tracking with task breakdowns
- **Collections**: Multi-session packages with dependencies

## 🎓 Who Benefits

- **Individual Students**: Gain structure and measurable progress in their jazz journey
- **Teachers**: Monitor student progress and assign specific practice tasks
- **Professional Musicians**: Maintain performance-ready repertoires while expanding skills

## 🔮 Future Development

The application structure is designed for rapid evolution. Planned enhancements include:
- Enhanced analytics and progress visualization
- Integration with backing track services
- Mobile app development
- Teacher-student collaboration features
- Advanced repertoire management tools

## 📝 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a personal project currently in active development. The structure is bound to change as features are added and refined over the next few months.

---

**Built with ❤️ for the jazz guitar community**
