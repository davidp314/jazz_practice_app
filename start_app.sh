#!/bin/bash

# Jazz Guitar Practice Tracker Startup Script
# This script starts the development server for the Jazz Guitar Practice Tracker

echo "🎸 Starting Jazz Guitar Practice Tracker..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the jazz-guitar-tracker directory."
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any existing Vite processes
echo "�� Killing existing Vite processes..."
pkill -f "vite" || true
sleep 2

# Start the development server
echo "🌐 Starting development server..."
echo "📍 Server will be available at: http://localhost:5173"
echo "🔄 Hot reload is enabled - changes will auto-refresh"
echo ""
echo "🎉 Jazz Guitar Practice Tracker is starting up!"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev

