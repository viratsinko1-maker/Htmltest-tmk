2# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple HTML/CSS/JavaScript web application for customer tracking, specifically designed for a Thai business (TMK Group) to record customer follow-up activities. The application allows users to:

- Add and delete table rows dynamically
- Input customer information (ID, name, days overdue, follow-up results)
- Save row data to memory (displayed in alerts and console)

## Architecture

The project consists of three main files working together:

- **test.html**: Main HTML structure with a data entry table and TMK Group branding
- **JsTest.js**: JavaScript functionality for dynamic row management and data saving
- **csstest.css**: Styling for the interface with Thai business-appropriate colors and layout

## Key Technical Details

### File Structure
```
├── test.html       # Main HTML page with table structure
├── JsTest.js       # JavaScript for table manipulation
└── csstest.css     # Styling and layout
```

### Data Flow
- User interactions trigger JavaScript functions (`addRow()`, `deleteRow()`, `saveRow()`)
- Data is stored in the `savedRows` array in memory
- No backend persistence - data is lost on page refresh

### UI Components
- Responsive table with customer input fields
- Thai language placeholders and labels
- Color-coded input fields (yellow for numbers, light green for text)
- TMK Group logo integration from CDN

## Common Development Commands

Since this is a static HTML/CSS/JavaScript project with no build system:

- **View the application**: Open `test.html` in a web browser
- **No build process required**: Changes to files are immediately reflected on browser refresh
- **No package manager**: Pure vanilla JavaScript with no dependencies

## Development Notes

- All text content is in Thai language
- Uses external CDN for TMK Group logo
- Input validation is minimal (HTML5 type attributes only)
- Data persistence would require backend integration
- CSS uses inline styles mixed with external stylesheet