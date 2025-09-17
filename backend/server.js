const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// SQL Server configuration
const config = {
    user: process.env.DB_USER || 'your-username',
    password: process.env.DB_PASSWORD || 'your-password',
    server: process.env.DB_SERVER || 'your-server',
    database: process.env.DB_DATABASE || 'your-database',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Test database connection
async function testConnection() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server successfully');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

// API Routes

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM customers`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new customer
app.post('/api/customers', async (req, res) => {
    try {
        const { customerId, fullName, daysOverdue, followUpResult } = req.body;

        await sql.connect(config);
        const result = await sql.query`
            INSERT INTO customers (customer_id, full_name, days_overdue, follow_up_result)
            VALUES (${customerId}, ${fullName}, ${daysOverdue}, ${followUpResult})
        `;

        res.json({ message: 'Customer added successfully', id: result.recordset });
    } catch (err) {
        console.error('Error adding customer:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customerId, fullName, daysOverdue, followUpResult } = req.body;

        await sql.connect(config);
        await sql.query`
            UPDATE customers
            SET customer_id = ${customerId}, full_name = ${fullName},
                days_overdue = ${daysOverdue}, follow_up_result = ${followUpResult}
            WHERE id = ${id}
        `;

        res.json({ message: 'Customer updated successfully' });
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await sql.connect(config);
        await sql.query`DELETE FROM customers WHERE id = ${id}`;

        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile('test.html', { root: '../frontend' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    testConnection();
});