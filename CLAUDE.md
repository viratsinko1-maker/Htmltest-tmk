2# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack customer tracking web application designed for a Thai business (TMK Group). The application supports importing data from SQL Server views/tables, editing customer information in a web interface, and exporting enhanced data back to SQL Server.

**Key Features:**
- Import data from SQL Server (Table1/View) with 5 columns
- Web-based editing interface with 2 additional user-input columns
- Export complete data (7 columns) to SQL Server (Table2)
- Dynamic table management (add/delete rows)
- Safe data workflow (source data protection)

## Architecture

The project is organized into separate frontend and backend components:

### Frontend (`frontend/` directory)
- **test.html**: Main HTML interface with data entry table and TMK Group branding
- **JsTest.js**: JavaScript for table manipulation and API communication
- **csstest.css**: Styling with Thai business-appropriate design

### Backend (`backend/` directory)
- **server.js**: Node.js Express server with SQL Server integration
- **package.json**: Node.js dependencies and scripts
- **.env**: Database connection configuration (not committed)

## File Structure
```
├── frontend/
│   ├── test.html       # Main web interface
│   ├── JsTest.js       # Frontend JavaScript
│   └── csstest.css     # Styling
├── backend/
│   ├── server.js       # Express API server
│   ├── package.json    # Node.js configuration
│   └── .env           # Database credentials (local only)
├── .gitignore         # Excludes node_modules and .env
└── CLAUDE.md          # This file
```

## Data Flow & Workflow

1. **Import**: Backend fetches data from SQL Server Table1/View (5 columns)
2. **Edit**: Frontend displays data with 2 additional editable columns
3. **Export**: Backend saves complete data (7 columns) to Table2
4. **Safety**: Source data (Table1) remains unchanged

### API Endpoints
- `GET /api/customers` - Import data from Table1/View
- `POST /api/customers` - Export data to Table2
- `PUT /api/customers/:id` - Update existing records
- `DELETE /api/customers/:id` - Delete records from Table2

## Common Development Commands

### Backend Development
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server (production)
npm run dev         # Start server with auto-reload
```

### Frontend Development
- Open `frontend/test.html` in browser
- Or access via backend server: `http://localhost:3000`

### Database Setup
1. Configure SQL Server connection in `backend/.env`
2. Create Table1/View with 5 columns for import
3. Create Table2 with 7 columns for export
4. Test connection: `npm start` in backend directory

## Environment Configuration

Create `backend/.env` with your SQL Server details:
```
DB_USER=your-username
DB_PASSWORD=your-password
DB_SERVER=your-server-name
DB_DATABASE=your-database-name
PORT=3000
```

## Development Notes

- **Language**: Thai language interface with English backend
- **Database**: SQL Server integration using mssql package
- **Security**: Environment variables for credentials
- **CORS**: Enabled for frontend-backend communication
- **Static Files**: Frontend served through Express
- **Git**: node_modules and .env excluded from version control