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

### 📊 Comprehensive Analytics & Visualizations
- **Interactive Charts**: Practice calendar heatmap, task distribution pie charts, weekly trend lines
- **Progress Tracking**: Visual progress bars for standards completion
- **Consistency Metrics**: Streak tracking and practice frequency analysis
- **Session Analytics**: Detailed time breakdowns and practice patterns
- **Practice Report Downloads**: Professional HTML reports for personal records and sharing
- Weekly and monthly practice statistics
- Detailed session history with time breakdowns
- Progress visualization across all standards
- Repertoire maintenance scheduling

### 👨‍🏫 Teacher Report System
- **Comprehensive Student Reports**: Multi-tab reports designed for music teachers
- **Standards Progress Analysis**: Visual tracking of student advancement through learning steps
- **Practice Pattern Insights**: Analysis of practice consistency, duration, and focus areas
- **Personalized Recommendations**: AI-generated suggestions based on practice data
- **Professional Presentation**: Clean, printable format suitable for parent-teacher conferences
- **PDF Export**: Professional PDF export functionality for parent-teacher conferences and record-keeping

### 📄 Practice Report Downloads
- **HTML Report Generation**: Download professional practice reports as HTML files
- **Personal Records**: Create reports for your own practice tracking and reflection
- **Teacher Sharing**: Share practice summaries with teachers or mentors
- **Print-Ready Format**: Optimized for both screen viewing and printing
- **Smart Recommendations**: AI-generated practice suggestions based on your data
- **Pattern Analysis**: Insights into practice habits and consistency trends

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
5. **Generate Practice Reports**:
   - Navigate to the Reports section
   - Click "📄 Download Report" to generate a professional practice summary
   - Open the downloaded HTML file in any browser for viewing or printing

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

## 📈 Advanced Analytics Features

### Visual Data Representations
- **Practice Calendar Heatmap**: GitHub-style calendar showing daily practice intensity
- **Task Distribution Charts**: Pie charts displaying time spent on different practice areas
- **Weekly Trend Analysis**: Line charts tracking practice duration and consistency over time
- **Standards Progress Bars**: Visual progress indicators for each learning step
- **Consistency Metrics**: Streak tracking and practice frequency analysis

### Teacher Report System
The teacher report provides comprehensive insights for music educators:

- **Overview Tab**: Key metrics including total practice time, consistency score, and standards progress
- **Standards Progress Tab**: Detailed analysis of student advancement through learning steps
- **Practice Analysis Tab**: Deep dive into practice patterns, time distribution, and focus areas
- **Recommendations Tab**: AI-generated suggestions for improvement based on practice data
- **PDF Export**: Professional PDF export functionality for parent-teacher conferences and record-keeping

### Practice Report Downloads
Generate professional practice reports for personal use or sharing with teachers:

- **Executive Summary**: Key metrics including total practice time, consistency, and streaks
- **Practice Calendar**: 30-day heatmap showing daily practice intensity
- **Standards Progress**: Visual progress tracking with status badges and completion rates
- **Practice Distribution**: Time breakdown across different practice areas
- **Pattern Analysis**: Insights into practice habits and consistency trends
- **Smart Recommendations**: Personalized suggestions for improvement
- **Recent Activity**: Last 10 practice sessions with completion status

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with Hooks
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.525.0
- **Build Tool**: Vite 7.0.0
- **Storage**: Local browser storage (no server required)
- **Development**: ESLint, PostCSS, Autoprefixer
- **Data Visualization**: Custom React components with Tailwind CSS

## 📁 Project Structure

```
jazz-guitar-tracker/
├── src/
│   ├── components/          # React components
│   │   ├── PracticeSession.jsx
│   │   ├── SessionSetup.jsx
│   │   ├── StandardCard.jsx
│   │   ├── TeacherReport.jsx    # Teacher report system with PDF export
│   │   ├── charts/              # New visualization components
│   │   │   ├── PracticeCalendar.jsx
│   │   │   ├── TaskDistributionChart.jsx
│   │   │   ├── WeeklyTrendChart.jsx
│   │   │   ├── ProgressBarChart.jsx
│   │   │   └── README.md
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── usePracticeSession.js
│   │   └── useCollections.js
│   ├── utils/              # Utility functions
│   │   ├── importExport.js
│   │   ├── stats.js
│   │   ├── chartData.js    # Chart data utilities
│   │   ├── pdfExport.js    # PDF export utilities
│   │   └── reportGenerator.js  # HTML report generation
│   ├── constants.js        # Application constants
│   └── App.jsx            # Main application component
├── doc/                   # Documentation
│   ├── manual.html        # Complete user manual
│   └── organization.html  # System architecture
├── demo_files/           # Sample data and examples
│   ├── jazz-guitar-demo-data.json    # Enhanced demo data
│   └── teacher_report_*.html         # Teacher report examples
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
- **Data Visualization**: Custom chart components with responsive design
- **Teacher Reports**: Comprehensive reporting system for music educators with PDF export
- **Practice Reports**: HTML report generation for personal tracking and sharing

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

### Enhanced Demo Data
The application includes comprehensive demo data for testing and demonstration:
- **Rich Practice History**: 15+ practice sessions with varied content
- **Multiple Standards**: Various jazz standards at different learning stages
- **Diverse Practice Work**: Technical exercises, transcriptions, and etudes
- **Realistic Patterns**: Simulated practice sessions with realistic time distributions

## 🎓 Who Benefits

- **Individual Students**: Gain structure and measurable progress in their jazz journey
- **Teachers**: Monitor student progress, generate professional reports, and assign specific practice tasks
- **Professional Musicians**: Maintain performance-ready repertoires while expanding skills

## 🔮 Future Development

The application structure is designed for rapid evolution. Planned enhancements include:
- **PDF Export**: Direct PDF generation for teacher reports
- **Enhanced Analytics**: More advanced statistical analysis and insights
- **Integration with Backing Track Services**: Seamless practice accompaniment
- **Mobile App Development**: Native mobile applications
- **Teacher-Student Collaboration**: Real-time progress sharing and feedback
- **Advanced Repertoire Management**: Set list creation and performance planning

## 📝 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a personal project currently in active development. The structure is bound to change as features are added and refined over the next few months.

---

**Built with ❤️ for the jazz guitar community**
