let savedRows = [];

function addRow() {
    const table = document.getElementById('HeaderTable');
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    cell1.innerHTML = '<input type="number" placeholder="เลขลูกค้า" />';
    cell2.innerHTML = '<input type="text" placeholder="ชื่อลูกค้า" />';
    cell3.innerHTML = '<input type="number" placeholder="ขาดนำส่งกี่วัน" />';
    cell4.innerHTML = '<input type="text" placeholder="ผลการติดตาม" />';
    cell5.innerHTML = '<button class="SaveRowButton" onclick="saveRow(this)">บันทึก</button>';
}
function deleteRow() {
    const table = document.getElementById('HeaderTable');
    if (table.rows.length > 1) {
        table.deleteRow(-1);
    } else {
        alert('No more row to delete');
    }
}

function saveRow(btn) {
    const row = btn.closest('tr');
    const inputs = row.querySelectorAll('input');
    const rowData = Array.from(inputs).map(input => input.value);
    savedRows.push(rowData);
    alert('บันทึกข้อมูล: ' + JSON.stringify(rowData));
    console.log('บันทึกข้อมูล:', rowData);
}
