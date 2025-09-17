2# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack customer tracking web application designed for a Thai business (TMK Group). The application supports importing data from CSV files or SQL Server views/tables, editing customer information in a web interface, and exporting enhanced data.

**Key Features:**
- CSV import with automatic loading and batch processing for large files
- Web-based editing interface with 4 user-input columns (status, description, username, timestamp)
- Individual row save functionality with real-time validation
- Resizable table columns with user-adjustable widths
- Two-page navigation system (data entry + export)
- Export to CSV and Excel formats
- Responsive design with Thai language interface
- Performance optimizations for large datasets (virtual scrolling)

## Architecture

The project is organized into separate frontend and backend components:

### Frontend (`frontend/` directory)
- **test.html**: Main HTML interface with sticky navigation and TMK Group branding
- **JsTest.js**: Vanilla JavaScript with CSV parsing, table manipulation, and column resizing
- **csstest.css**: Modern CSS with resizable columns and Thai business design
- **list.csv**: Sample customer data for testing and development

### Backend (`backend/` directory)
- **server.js**: Node.js Express server with SQL Server integration and static file serving
- **package.json**: Node.js dependencies and scripts
- **.env**: Database connection configuration (not committed)
- **test-database.sqlite**: Local development database (if needed)

## File Structure
```
├── frontend/
│   ├── test.html       # Main web interface with two-page system
│   ├── JsTest.js       # Vanilla JS with CSV parsing & column resizing
│   ├── csstest.css     # Modern responsive CSS styling
│   └── list.csv        # Sample customer data
├── backend/
│   ├── server.js       # Express API server
│   ├── package.json    # Node.js configuration
│   ├── .env           # Database credentials (local only)
│   └── test-database.sqlite  # Local development database
├── .gitignore         # Excludes node_modules and .env
└── CLAUDE.md          # This file
```

## Data Flow & Workflow

### Primary CSV Workflow:
1. **Import**: Automatic CSV loading from `list.csv` with batch processing for performance
2. **Display**: Data shown in resizable table with 12+ original columns from CSV
3. **Edit**: Users add 4 input columns (status dropdown, description, username, timestamp)
4. **Save**: Individual row saving with validation and real-time feedback
5. **Export**: Complete data exported to CSV/Excel with all original + user input columns

### Alternative SQL Server Workflow:
1. **Import**: Backend fetches data from SQL Server `vw_CustomerTrackingReport`
2. **Edit**: Frontend displays data with 4 additional editable columns
3. **Export**: Backend saves enhanced data to SQL Server Table2
4. **Safety**: Source data remains unchanged

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
- Open `frontend/test.html` directly in browser for development
- Or access via backend server: `http://localhost:3001` (note: port 3001)
- CSV file automatically loads on page initialization
- Use browser dev tools to monitor batch processing progress

### Database Setup
1. Configure SQL Server connection in `backend/.env`
2. Create Table1/View with 5 columns for import
3. Create Table2 with 7 columns for export
4. Test connection: `npm start` in backend directory

## Environment Configuration

Create `backend/.env` with your SQL Server details:
```
DB_SERVER=161.82.175.15\scale
DB_PORT=8990
DB_DATABASE=PalmCenter
DB_USER=powerquery_hq
DB_PASSWORD=@Tmk963*
PORT=3001
```

## Development Notes

- **Architecture**: Vanilla JavaScript (no React/Vue needed for this use case)
- **Language**: Thai language interface with English backend code
- **Database**: SQL Server integration using mssql package (fallback option)
- **Primary Data Source**: CSV files with automatic loading and parsing
- **Performance**: Batch processing for large CSV files, virtual scrolling for 1000+ rows
- **UI Features**: Resizable columns, sticky headers, individual row operations
- **Security**: Environment variables for credentials, no sensitive data in frontend
- **CORS**: Enabled for frontend-backend communication
- **Static Files**: Frontend served through Express on port 3001
- **Git**: node_modules and .env excluded from version control

## User Interface Features

### Table Functionality:
- **Resizable Columns**: Drag column borders to adjust width
- **Sticky Navigation**: Navigation bar stays at top during scroll
- **Sticky Headers**: Table headers remain visible during vertical scroll
- **Individual Row Save**: Each row has its own save button for granular control
- **Auto-timestamp**: Automatic timestamp generation when saving rows

### Data Input Columns:
1. **สถานะการนำส่ง** - Dropdown (มีนำส่ง/ขาดการนำส่ง)
2. **คำอธิบาย** - Textarea for detailed descriptions
3. **ผู้บันทึก** - Username input field
4. **วันที่/เวลา** - Auto-generated timestamp display

### Performance Optimizations:
- Batch processing for CSV parsing (prevents browser freezing)
- Virtual scrolling for large datasets
- Progress indicators during file processing
- Efficient DOM manipulation for smooth user experience

## Troubleshooting

### Common Issues:
1. **Empty table above header**: Adjust `top` position in CSS for sticky headers
2. **Column resize not working**: Ensure mouse events are properly bound after table generation
3. **CSV not loading**: Check console for file path errors, ensure list.csv exists in frontend directory
4. **SQL Server connection fails**: Verify network connectivity and credentials in .env file
5. **Text overlapping in cells**: Use CSS text clipping or adjust column widths

### Development Tips:
- Use browser dev tools to monitor CSV parsing progress
- Check console for JavaScript errors during table operations
- Test with small CSV files first before loading large datasets
- Ensure proper Thai language encoding (UTF-8) for text display