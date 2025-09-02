# Jazz Guitar Tracker V2 - Setup Plan

This document outlines the recommended approach for setting up the V2 development environment alongside the existing V1 app.

## Directory Structure Strategy

### Current Setup
```
/home/davidp/music/practice_app/
└── jazz-guitar-tracker/          # Your current V1 app
```

### Recommended New Structure
```
/home/davidp/music/practice_app/
├── jazz-guitar-tracker-v1/       # Renamed V1 (keeps everything working)
├── jazz-guitar-tracker-v2/       # New clean V2 app
└── README.md                     # Optional: document both versions
```

## Step-by-Step Setup Process

### 1. Rename Current App for Clarity (Recommended)
```bash
cd /home/davidp/music/practice_app/
mv jazz-guitar-tracker jazz-guitar-tracker-v1
```
**Why**: Makes it clear which version you're working with and prevents confusion.

### 2. Create New V2 Directory
```bash
cd /home/davidp/music/practice_app/
mkdir jazz-guitar-tracker-v2
cd jazz-guitar-tracker-v2
```

### 3. Copy Planning Documents to V2
```bash
# From the V1 directory, copy essential planning files
cp ../jazz-guitar-tracker-v1/V2_DEVELOPMENT_PLAN.md .
cp ../jazz-guitar-tracker-v1/CLAUDE.md .
cp ../jazz-guitar-tracker-v1/V2_SETUP_PLAN.md .
```

### 4. Initialize V2 Project
```bash
# Inside jazz-guitar-tracker-v2/
npm create vite@latest . -- --template react-ts
npm install
```

## Parallel Development Strategy

### Keep V1 Fully Functional
- **Don't modify any V1 files** during V2 development
- Keep V1 available for daily practice use
- V1 data remains safe and accessible

### Run Both Apps Simultaneously
```bash
# Terminal 1: Run V1 (if needed for reference)
cd jazz-guitar-tracker-v1
npm run dev  # Runs on port 5173

# Terminal 2: Run V2 during development
cd jazz-guitar-tracker-v2  
npm run dev  # Runs on port 5174
```

### Development Workflow
1. **Use V1** for daily practice (keeps your routine uninterrupted)
2. **Build V2** incrementally with Claude's help
3. **Compare features** by running both apps side-by-side
4. **Test V2** against V1 behavior for exact feature matching
5. **Switch to V2** only when it reaches full feature parity

## What to Copy vs. Start Fresh

### Reference from V1 (Don't Copy Code)
- Business logic patterns (how timers work, data calculations)
- UI component behavior (exact user interactions)
- Sample data structures (for realistic testing)
- Feature workflows (session setup → practice → completion)

### Copy to V2 Directory
- Planning documents (V2_DEVELOPMENT_PLAN.md, etc.)
- Any design assets or documentation
- Configuration preferences that aren't code

### Start Fresh in V2
- All source code files (.jsx, .js, .css)
- package.json (new dependencies for TypeScript, Zustand, etc.)
- node_modules directory
- Build configuration (vite.config.ts, etc.)
- Git history (optional: can start fresh git repo)

## File Organization

### V1 Directory Contents (Keep Untouched)
```
jazz-guitar-tracker-v1/
├── src/                          # All existing source code
├── package.json                  # Current dependencies  
├── README.md                     # Current documentation
├── node_modules/                 # Current dependencies
└── All other existing files...   # Keep everything as-is
```

### V2 Directory Structure (Fresh Start)
```
jazz-guitar-tracker-v2/
├── src/                          # New TypeScript source code
├── package.json                  # New dependencies (Zustand, TypeScript, etc.)
├── tsconfig.json                 # TypeScript configuration
├── V2_DEVELOPMENT_PLAN.md        # Copied planning document
├── V2_SETUP_PLAN.md             # This document
└── All new files...             # Fresh project structure
```

## Port Configuration

To avoid conflicts when running both apps:

### V1 Port (Default)
- Vite usually runs on `http://localhost:5173`
- Keep V1 on its default port

### V2 Port (Configured)
If needed, configure V2 to use a different port in `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174  // Different port to avoid conflicts
  }
})
```

## Data Migration Planning

### During Development
- V1 data stays in its localStorage
- V2 can start with fresh sample data
- No need to migrate data during development

### When V2 is Ready
- Implement data import from V1 localStorage format
- Create migration utility to convert V1 data to V2 schema
- Test migration thoroughly before switching

## Benefits of This Approach

### Risk Mitigation
- **Zero downtime**: V1 keeps working throughout V2 development
- **Data safety**: Practice history and settings remain untouched
- **Rollback option**: Can always go back to V1 if needed

### Development Advantages  
- **Side-by-side comparison**: Easy to verify V2 matches V1 behavior
- **Reference implementation**: V1 code available for Claude to analyze
- **Incremental testing**: Can test individual features against V1

### User Experience
- **Continuous use**: Daily practice routine uninterrupted
- **Smooth transition**: Switch only when V2 is fully ready
- **Data preservation**: All practice history migrates safely

## Timeline Expectations

### Phase 1: Setup (Day 1)
- Rename directories
- Initialize V2 project
- Set up development environment

### Phase 2: Development (Days 2-25)  
- Build V2 incrementally
- Regular comparison with V1
- Feature-by-feature implementation

### Phase 3: Migration (Days 26-28)
- Implement V1 data import
- Final testing and polish
- Switch to V2 as primary app

### Phase 4: Cleanup (Optional)
- Archive V1 directory
- Clean up development files
- Document lessons learned

## Commands Quick Reference

```bash
# Setup commands
cd /home/davidp/music/practice_app/
mv jazz-guitar-tracker jazz-guitar-tracker-v1
mkdir jazz-guitar-tracker-v2
cd jazz-guitar-tracker-v2

# Initialize V2
npm create vite@latest . -- --template react-ts
npm install

# Development commands
npm run dev      # Start V2 development server
npm run build    # Build V2 for production  
npm run lint     # Check code quality
npm run test     # Run tests (once set up)

# Run both apps simultaneously
cd jazz-guitar-tracker-v1 && npm run dev &  # V1 in background
cd jazz-guitar-tracker-v2 && npm run dev    # V2 in foreground
```

This setup ensures a smooth, risk-free transition to the improved V2 architecture while maintaining full access to your current working app!