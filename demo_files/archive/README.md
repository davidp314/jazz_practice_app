# Archived Demo Files

This directory contains demo files that are no longer compatible with the current Jazz Guitar Practice Tracker application.

## Why These Files Were Archived

The application underwent a major update that introduced:
1. **Goals System** - New goal tracking and accountability features
2. **Generalized Practice Packages** - Renamed from "teacher sessions" to "practice packages"
3. **Updated Data Structure** - New fields and relationships between data

## Archived Files

### `comping-progression-series.json`
- **Old Format**: `"type": "teacher_session_series"`
- **New Format**: `"type": "practice_package_series"`
- **Changes**: Updated field names and structure

### `jazz-guitar-demo-data.json`
- **Missing**: Goals array and updated practice packages
- **New Format**: Includes comprehensive goals with linked tasks

### `david.json`, `david-2025-07-14.json`, `jazz-guitar-practice-backup-2025-07-12.json`
- **Status**: Legacy user data files
- **Compatibility**: May need migration for new features

## Current Compatible Files

The following files in the parent directory are compatible with the current system:
- `jazz-guitar-demo-data.json` (updated version)
- `comping-progression-series.json` (updated version)
- `jazz-guitar-blank-data.json`

## Migration Notes

If you need to use data from these archived files:
1. The import functions in the app include migration logic
2. Old "teacher session" data will be converted to "practice packages"
3. Goals will need to be created manually for existing data
4. Task-goal linking can be done through the UI

## Date Archived
January 15, 2025 - During implementation of goals and practice packages features. 