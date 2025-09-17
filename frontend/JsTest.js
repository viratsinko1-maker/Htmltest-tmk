// Global variables
let csvData = [];
let exportData = [];
let currentEditingRow = null;

// Page navigation functions
function showDataEntry() {
    document.getElementById('dataEntryPage').classList.add('active');
    document.getElementById('exportPage').classList.remove('active');
    document.getElementById('dataEntryBtn').classList.add('active');
    document.getElementById('exportBtn').classList.remove('active');
}

function showExport() {
    document.getElementById('dataEntryPage').classList.remove('active');
    document.getElementById('exportPage').classList.add('active');
    document.getElementById('dataEntryBtn').classList.remove('active');
    document.getElementById('exportBtn').classList.add('active');
    updateExportTable();
}

// CSV file upload and parsing
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Size:', file.size);

    // Show file name
    document.getElementById('fileName').textContent = `ไฟล์: ${file.name}`;

    // Show table section immediately
    document.getElementById('tableSection').style.display = 'block';

    // Show loading message
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 50px; color: #3498db;"><i class="icon">⏳</i> กำลังโหลดไฟล์...</td></tr>';

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('File loaded, size:', e.target.result.length);
        const csv = e.target.result;
        parseCSV(csv);
    };
    reader.readAsText(file, 'UTF-8');
}

function parseCSV(csv) {
    console.log('Starting CSV parsing...');

    // Remove BOM if present
    csv = csv.replace(/^\ufeff/, '');

    const lines = csv.split('\n');
    console.log('Total lines:', lines.length);

    if (lines.length === 0) {
        console.error('No lines in CSV');
        return;
    }

    const headers = parseCSVLine(lines[0]);
    console.log('Headers found:', headers);

    csvData = [];
    let processedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= headers.length - 2) { // Allow some flexibility
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });

                // Add new columns for user input
                row['สถานะการนำส่ง'] = '';
                row['คำอธิบาย'] = '';
                row['ผู้บันทึก'] = '';
                row['วันที่/เวลาบันทึก'] = '';
                csvData.push(row);
                processedCount++;
            }
        }
    }

    console.log(`Parsed ${csvData.length} rows successfully`);

    if (csvData.length > 0) {
        generateTable(headers);
        document.getElementById('tableSection').style.display = 'block';
    } else {
        // Show error message
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 50px; color: #e74c3c;">ไม่สามารถประมวลผลข้อมูลได้ กรุณาตรวจสอบรูปแบบไฟล์</td></tr>';
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result.map(value => value.replace(/"/g, ''));
}

function generateTable(originalHeaders) {
    console.log('Generating table with headers:', originalHeaders);
    console.log('CSV data length:', csvData.length);

    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    if (!tableHead || !tableBody) {
        console.error('Table elements not found');
        return;
    }

    // Clear existing content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Create headers (original + new columns)
    const allHeaders = [...originalHeaders, 'สถานะการนำส่ง', 'คำอธิบาย', 'ผู้บันทึก', 'วันที่/เวลา', 'การดำเนินการ'];
    console.log('All headers:', allHeaders);

    const headerRow = document.createElement('tr');
    allHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows
    csvData.forEach((rowData, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        // Original data columns (read-only)
        originalHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = rowData[header] || '';
            td.style.backgroundColor = '#f8f9fa';
            row.appendChild(td);
        });

        // Status dropdown
        const statusTd = document.createElement('td');
        statusTd.innerHTML = `
            <select class="status-select" onchange="updateRowData(${index}, 'status', this.value)">
                <option value="">เลือก...</option>
                <option value="มีนำส่ง" ${rowData.status === 'มีนำส่ง' ? 'selected' : ''}>มีนำส่ง</option>
                <option value="ขาดการนำส่ง" ${rowData.status === 'ขาดการนำส่ง' ? 'selected' : ''}>ขาดการนำส่ง</option>
            </select>
        `;
        row.appendChild(statusTd);

        // Description input
        const descTd = document.createElement('td');
        descTd.innerHTML = `
            <textarea class="description-input"
                      placeholder="ใส่คำอธิบาย..."
                      onchange="updateRowData(${index}, 'description', this.value)"
                      rows="2">${rowData.description}</textarea>
        `;
        row.appendChild(descTd);

        // Username input
        const userTd = document.createElement('td');
        userTd.innerHTML = `
            <input type="text" class="username-input"
                   placeholder="ชื่อผู้บันทึก..."
                   onchange="updateRowData(${index}, 'username', this.value)"
                   value="${rowData.username}">
        `;
        row.appendChild(userTd);

        // Timestamp display (locked)
        const timestampTd = document.createElement('td');
        timestampTd.innerHTML = `
            <div class="timestamp-display">${rowData.timestamp || 'ยังไม่บันทึก'}</div>
        `;
        row.appendChild(timestampTd);

        // Action buttons
        const actionTd = document.createElement('td');
        actionTd.innerHTML = `
            <div class="row-actions">
                <button class="save-row-btn" onclick="saveRowData(${index})">
                    <i class="icon">💾</i> บันทึก
                </button>
            </div>
        `;
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });

    // Make columns resizable after table is created
    setTimeout(() => makeColumnsResizable(), 100);
}

function updateRowData(index, field, value) {
    if (csvData[index]) {
        csvData[index][field] = value;
    }
}

function saveRowData(index) {
    if (!csvData[index]) return;

    const row = csvData[index];

    // Validate required fields
    if (!row['สถานะการนำส่ง']) {
        alert('กรุณาเลือกสถานะการนำส่ง');
        return;
    }

    if (!row['ผู้บันทึก']) {
        alert('กรุณาใส่ชื่อผู้บันทึก');
        return;
    }

    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    csvData[index]['วันที่/เวลาบันทึก'] = timestamp;

    // Update the display
    const rowElement = document.querySelector(`tr[data-index="${index}"]`);
    if (rowElement) {
        const timestampCell = rowElement.querySelector('.timestamp-display');
        if (timestampCell) {
            timestampCell.textContent = timestamp;
            timestampCell.style.backgroundColor = '#d5f4e6';
            timestampCell.style.color = '#27ae60';
        }
    }

    // Add to export data if not already there
    const newColumns = ['สถานะการนำส่ง', 'คำอธิบาย', 'ผู้บันทึก', 'วันที่/เวลาบันทึก'];
    const existingIndex = exportData.findIndex(item => {
        // Compare based on original data (excluding new columns)
        const itemOriginal = Object.keys(item).reduce((obj, key) => {
            if (!newColumns.includes(key)) {
                obj[key] = item[key];
            }
            return obj;
        }, {});

        const rowOriginal = Object.keys(row).reduce((obj, key) => {
            if (!newColumns.includes(key)) {
                obj[key] = row[key];
            }
            return obj;
        }, {});

        return JSON.stringify(itemOriginal) === JSON.stringify(rowOriginal);
    });

    if (existingIndex >= 0) {
        exportData[existingIndex] = { ...row };
    } else {
        exportData.push({ ...row });
    }

    alert('บันทึกข้อมูลเรียบร้อย!');
}

function saveAllData() {
    let savedCount = 0;
    let errors = [];

    // Get all currently displayed rows
    const displayedRows = document.querySelectorAll('#tableBody tr[data-index]');
    const totalDisplayed = displayedRows.length;

    csvData.slice(0, totalDisplayed).forEach((row, index) => {
        if (row['สถานะการนำส่ง'] && row['ผู้บันทึก']) {
            saveRowData(index);
            savedCount++;
        } else {
            let missing = [];
            if (!row['สถานะการนำส่ง']) missing.push('สถานะการนำส่ง');
            if (!row['ผู้บันทึก']) missing.push('ชื่อผู้บันทึก');
            errors.push(`แถวที่ ${index + 1}: ขาด ${missing.join(', ')}`);
        }
    });

    let message = `บันทึกสำเร็จ ${savedCount} แถว`;

    if (csvData.length > totalDisplayed) {
        message += `\n(จากทั้งหมด ${totalDisplayed} แถวที่แสดงผล / ${csvData.length} แถวทั้งหมด)`;
    }

    if (errors.length > 0) {
        const maxErrorsToShow = 10;
        const errorMessage = errors.slice(0, maxErrorsToShow).join('\n');
        const remainingErrors = errors.length - maxErrorsToShow;

        message += `\n\nข้อผิดพลาด:\n${errorMessage}`;
        if (remainingErrors > 0) {
            message += `\n... และอีก ${remainingErrors} ข้อผิดพลาด`;
        }
    }

    alert(message);
}

function updateExportTable() {
    const exportTableHead = document.getElementById('exportTableHead');
    const exportTableBody = document.getElementById('exportTableBody');

    // Clear existing content
    exportTableHead.innerHTML = '';
    exportTableBody.innerHTML = '';

    if (exportData.length === 0) {
        exportTableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 50px; color: #7f8c8d;">ยังไม่มีข้อมูลที่ส่งออก</td></tr>';
        return;
    }

    // Get headers from first row
    const headers = Object.keys(exportData[0]);

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    exportTableHead.appendChild(headerRow);

    // Create data rows
    exportData.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            if (header === 'สถานะการนำส่ง') {
                td.style.color = rowData[header] === 'มีนำส่ง' ? '#27ae60' : '#e74c3c';
                td.style.fontWeight = 'bold';
            }
            if (header === 'วันที่/เวลาบันทึก') {
                td.style.fontFamily = 'monospace';
                td.style.fontSize = '12px';
            }

            const cellValue = rowData[header] || '';
            td.textContent = cellValue;
            td.title = cellValue; // Show full value on hover
            row.appendChild(td);
        });
        exportTableBody.appendChild(row);
    });
}

function exportToCSV() {
    if (exportData.length === 0) {
        alert('ไม่มีข้อมูลให้ส่งออก');
        return;
    }

    const headers = Object.keys(exportData[0]);
    let csvContent = headers.join(',') + '\n';

    exportData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvContent += values.join(',') + '\n';
    });

    downloadFile(csvContent, 'customer_export.csv', 'text/csv');
    alert('ส่งออกไฟล์ CSV เรียบร้อย!');
}

function exportToExcel() {
    if (exportData.length === 0) {
        alert('ไม่มีข้อมูลให้ส่งออก');
        return;
    }

    // Convert to CSV format for Excel
    exportToCSV();
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob(['\ufeff' + content], { type: contentType + ';charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Sticky navigation behavior
window.addEventListener('scroll', function() {
    const stickyNav = document.getElementById('stickyNav');
    const tableSection = document.getElementById('tableSection');

    if (tableSection && tableSection.style.display !== 'none') {
        const tableSectionRect = tableSection.getBoundingClientRect();

        if (tableSectionRect.top <= 0) {
            stickyNav.style.position = 'fixed';
            stickyNav.style.top = '0';
            stickyNav.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        } else {
            stickyNav.style.position = 'sticky';
            stickyNav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
    }
});

// Auto-load CSV file
async function autoLoadCSV() {
    try {
        // Show loading indicator
        const tableSection = document.getElementById('tableSection');
        tableSection.style.display = 'block';
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 50px; color: #3498db;"><i class="icon">⏳</i> กำลังโหลดข้อมูล...</td></tr>';

        // Fetch the CSV file
        const response = await fetch('list.csv');
        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดไฟล์ CSV ได้');
        }

        const csvText = await response.text();

        // Update file name display
        document.getElementById('fileName').textContent = 'ไฟล์: list.csv (โหลดอัตโนมัติ)';
        document.getElementById('fileName').style.color = '#27ae60';

        // Parse and display the CSV
        parseCSV(csvText);

        console.log(`โหลดข้อมูลเรียบร้อย: ${csvData.length} แถว`);

    } catch (error) {
        console.error('Error loading CSV:', error);

        // Show error message
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align: center; padding: 50px; color: #e74c3c;">
                    <i class="icon">❌</i> ไม่สามารถโหลดข้อมูลอัตโนมัติได้<br>
                    <small>กรุณาเลือกไฟล์ CSV ด้วยตนเอง</small>
                </td>
            </tr>
        `;

        // Hide table section and show upload section
        setTimeout(() => {
            document.getElementById('tableSection').style.display = 'none';
        }, 3000);
    }
}

// Enhanced CSV parsing for large files
function parseCSV(csv) {
    // Remove BOM if present
    csv = csv.replace(/^\ufeff/, '');

    const lines = csv.split('\n');
    const headers = parseCSVLine(lines[0]);

    csvData = [];
    let processedCount = 0;
    const batchSize = 100; // Process in batches for better performance

    // Show initial progress
    const tableBody = document.getElementById('tableBody');

    function processBatch(startIndex) {
        const endIndex = Math.min(startIndex + batchSize, lines.length);

        for (let i = startIndex; i < endIndex; i++) {
            if (lines[i].trim()) {
                const values = parseCSVLine(lines[i]);
                if (values.length >= headers.length - 2) { // Allow some flexibility
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });

                    // Add new columns for user input
                    row['สถานะการนำส่ง'] = '';
                    row['คำอธิบาย'] = '';
                    row['ผู้บันทึก'] = '';
                    row['วันที่/เวลาบันทึก'] = '';

                    csvData.push(row);
                    processedCount++;
                }
            }
        }

        // Update progress
        const progress = Math.round((endIndex / lines.length) * 100);
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align: center; padding: 50px; color: #3498db;">
                    <i class="icon">⏳</i> กำลังประมวลผลข้อมูล... ${progress}%<br>
                    <small>ประมวลผลแล้ว ${processedCount} แถว</small>
                </td>
            </tr>
        `;

        // Continue processing or finish
        if (endIndex < lines.length) {
            setTimeout(() => processBatch(endIndex), 10); // Small delay to prevent blocking
        } else {
            // Finished processing
            generateTable(headers);
            console.log(`ประมวลผลเสร็จสิ้น: ${csvData.length} แถว`);
        }
    }

    // Start processing if there's data
    if (lines.length > 1) {
        processBatch(1); // Start from line 1 (skip header)
    } else {
        tableBody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 50px; color: #e74c3c;">ไม่พบข้อมูลในไฟล์</td></tr>';
    }
}

// Enhanced table generation for large datasets
function generateTable(originalHeaders) {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    // Clear existing content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Create headers (original + new columns)
    const newColumns = ['สถานะการนำส่ง', 'คำอธิบาย', 'ผู้บันทึก', 'วันที่/เวลาบันทึก', 'การดำเนินการ'];
    const allHeaders = [...originalHeaders, ...newColumns];

    const headerRow = document.createElement('tr');
    allHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        if (newColumns.includes(header)) {
            th.style.backgroundColor = '#e74c3c'; // Highlight new columns
        }
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows with virtual scrolling for performance
    const maxDisplayRows = 50; // Show first 50 rows initially
    const displayData = csvData.slice(0, maxDisplayRows);

    displayData.forEach((rowData, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        // Original data columns (read-only)
        originalHeaders.forEach(header => {
            const td = document.createElement('td');
            const cellValue = rowData[header] || '';
            td.textContent = cellValue;
            td.title = cellValue; // Show full value on hover
            td.style.backgroundColor = '#f8f9fa';
            td.style.fontSize = '12px';
            row.appendChild(td);
        });

        // Status dropdown
        const statusTd = document.createElement('td');
        statusTd.className = 'input-column';
        statusTd.innerHTML = `
            <select class="status-select" onchange="updateRowData(${index}, 'สถานะการนำส่ง', this.value)">
                <option value="">เลือก...</option>
                <option value="มีนำส่ง">มีนำส่ง</option>
                <option value="ขาดการนำส่ง">ขาดการนำส่ง</option>
            </select>
        `;
        row.appendChild(statusTd);

        // Description input
        const descTd = document.createElement('td');
        descTd.className = 'description-column';
        descTd.innerHTML = `
            <textarea class="description-input"
                      placeholder="ใส่คำอธิบาย..."
                      onchange="updateRowData(${index}, 'คำอธิบาย', this.value)"
                      rows="3"></textarea>
        `;
        row.appendChild(descTd);

        // Username input
        const userTd = document.createElement('td');
        userTd.className = 'username-column';
        userTd.innerHTML = `
            <input type="text" class="username-input"
                   placeholder="ชื่อผู้บันทึก..."
                   onchange="updateRowData(${index}, 'ผู้บันทึก', this.value)"
                   value="">
        `;
        row.appendChild(userTd);

        // Timestamp display (locked)
        const timestampTd = document.createElement('td');
        timestampTd.className = 'timestamp-column';
        timestampTd.innerHTML = `
            <div class="timestamp-display">ยังไม่บันทึก</div>
        `;
        row.appendChild(timestampTd);

        // Action buttons
        const actionTd = document.createElement('td');
        actionTd.className = 'action-column';
        actionTd.innerHTML = `
            <button class="save-row-btn" onclick="saveRowData(${index})" title="บันทึกข้อมูลแถวนี้">
                💾 บันทึก
            </button>
        `;
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });

    // Add load more button if there are more rows
    if (csvData.length > maxDisplayRows) {
        const loadMoreRow = document.createElement('tr');
        loadMoreRow.innerHTML = `
            <td colspan="${allHeaders.length}" style="text-align: center; padding: 20px;">
                <button onclick="loadMoreRows()" class="save-btn">
                    <i class="icon">📄</i> แสดงข้อมูลเพิ่มเติม (${csvData.length - maxDisplayRows} แถว)
                </button>
            </td>
        `;
        tableBody.appendChild(loadMoreRow);
    }
}

// Load more rows function
function loadMoreRows() {
    const currentRows = document.querySelectorAll('#tableBody tr[data-index]').length;
    const nextBatch = csvData.slice(currentRows, currentRows + 50);
    const tableBody = document.getElementById('tableBody');
    const originalHeaders = Object.keys(csvData[0]).filter(h =>
        !['สถานะการนำส่ง', 'คำอธิบาย', 'ผู้บันทึก', 'วันที่/เวลาบันทึก'].includes(h)
    );

    // Remove load more button
    const loadMoreButton = tableBody.querySelector('tr:last-child');
    if (loadMoreButton && !loadMoreButton.dataset.index) {
        tableBody.removeChild(loadMoreButton);
    }

    nextBatch.forEach((rowData, batchIndex) => {
        const index = currentRows + batchIndex;
        const row = document.createElement('tr');
        row.dataset.index = index;

        // Original data columns (read-only)
        originalHeaders.forEach(header => {
            const td = document.createElement('td');
            const cellValue = rowData[header] || '';
            td.textContent = cellValue;
            td.title = cellValue;
            td.style.backgroundColor = '#f8f9fa';
            td.style.fontSize = '12px';
            row.appendChild(td);
        });

        // Add input columns (same as above)
        const statusTd = document.createElement('td');
        statusTd.className = 'input-column';
        statusTd.innerHTML = `
            <select class="status-select" onchange="updateRowData(${index}, 'สถานะการนำส่ง', this.value)">
                <option value="">เลือก...</option>
                <option value="มีนำส่ง">มีนำส่ง</option>
                <option value="ขาดการนำส่ง">ขาดการนำส่ง</option>
            </select>
        `;
        row.appendChild(statusTd);

        const descTd = document.createElement('td');
        descTd.className = 'description-column';
        descTd.innerHTML = `
            <textarea class="description-input"
                      placeholder="ใส่คำอธิบาย..."
                      onchange="updateRowData(${index}, 'คำอธิบาย', this.value)"
                      rows="3"></textarea>
        `;
        row.appendChild(descTd);

        const userTd = document.createElement('td');
        userTd.className = 'username-column';
        userTd.innerHTML = `
            <input type="text" class="username-input"
                   placeholder="ชื่อผู้บันทึก..."
                   onchange="updateRowData(${index}, 'ผู้บันทึก', this.value)"
                   value="">
        `;
        row.appendChild(userTd);

        const timestampTd = document.createElement('td');
        timestampTd.className = 'timestamp-column';
        timestampTd.innerHTML = `<div class="timestamp-display">ยังไม่บันทึก</div>`;
        row.appendChild(timestampTd);

        const actionTd = document.createElement('td');
        actionTd.className = 'action-column';
        actionTd.innerHTML = `
            <button class="save-row-btn" onclick="saveRowData(${index})" title="บันทึกข้อมูลแถวนี้">
                💾 บันทึก
            </button>
        `;
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });

    // Add load more button again if needed
    const newCurrentRows = document.querySelectorAll('#tableBody tr[data-index]').length;
    if (newCurrentRows < csvData.length) {
        const loadMoreRow = document.createElement('tr');
        loadMoreRow.innerHTML = `
            <td colspan="20" style="text-align: center; padding: 20px;">
                <button onclick="loadMoreRows()" class="save-btn">
                    <i class="icon">📄</i> แสดงข้อมูลเพิ่มเติม (${csvData.length - newCurrentRows} แถว)
                </button>
            </td>
        `;
        tableBody.appendChild(loadMoreRow);
    }

    // Make columns resizable after table is created
    setTimeout(() => makeColumnsResizable(), 100);
}

// Test function to check if file upload works
function testFileUpload() {
    console.log('Testing file upload functionality...');
    const fileInput = document.getElementById('csvFile');
    const fileName = document.getElementById('fileName');
    const tableSection = document.getElementById('tableSection');

    console.log('File input:', fileInput);
    console.log('File name display:', fileName);
    console.log('Table section:', tableSection);

    if (!fileInput) {
        console.error('CSV file input not found!');
        return false;
    }

    if (!fileName) {
        console.error('File name display not found!');
        return false;
    }

    if (!tableSection) {
        console.error('Table section not found!');
        return false;
    }

    console.log('All elements found successfully!');
    return true;
}

// Column resizing functionality
function makeColumnsResizable() {
    const table = document.querySelector('.customer-table');
    if (!table) return;

    let isResizing = false;
    let currentColumn = null;
    let startX = 0;
    let startWidth = 0;

    // Add mouse event listeners to table headers
    document.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'TH') {
            const rect = e.target.getBoundingClientRect();
            const isNearRightEdge = e.clientX > rect.right - 15;

            if (isNearRightEdge) {
                isResizing = true;
                currentColumn = e.target;
                startX = e.clientX;
                startWidth = currentColumn.offsetWidth;

                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isResizing && currentColumn) {
            const width = startWidth + (e.clientX - startX);
            const newWidth = Math.max(50, width);
            currentColumn.style.width = newWidth + 'px';
            currentColumn.style.minWidth = newWidth + 'px';
            e.preventDefault();
        } else {
            // Change cursor when hovering near right edge of headers
            if (e.target.tagName === 'TH') {
                const rect = e.target.getBoundingClientRect();
                const isNearRightEdge = e.clientX > rect.right - 15;
                e.target.style.cursor = isNearRightEdge ? 'col-resize' : 'default';
            }
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (isResizing) {
            isResizing = false;
            currentColumn = null;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
            e.preventDefault();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');

    // Test basic functionality
    testFileUpload();

    // Show data entry page by default
    showDataEntry();

    // Auto-load CSV file
    autoLoadCSV();

    // Make columns resizable
    makeColumnsResizable();
});