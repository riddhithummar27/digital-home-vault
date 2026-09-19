const pool = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Digital Home Vault Backend Running");
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Database connected!",
            time: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/rooms", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM rooms ORDER BY name"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/assets", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM assets ORDER BY name"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/documents", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM documents ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/warranties", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM warranties ORDER BY end_date"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/reminders", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM reminders ORDER BY due_date"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/maintenance", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM maintenance_records ORDER BY next_service_date"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/rooms", async (req, res) => {
    try {
        const { household_id, name, room_type } = req.body;

        if (!household_id || !name || !room_type) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO rooms (household_id, name, room_type)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [household_id, name, room_type]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/assets", async (req, res) => {
    try {
        const {
            household_id,
            room_id,
            category_id,
            name,
            asset_type,
            brand,
            model,
            serial_number,
            purchase_date,
            purchase_price,
            description
        } = req.body;

        if (!household_id || !name || !asset_type) {
            return res.status(400).json({
                error: "household_id, name and asset_type are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO assets (
                household_id, room_id, category_id, name,
                asset_type, brand, model, serial_number,
                purchase_date, purchase_price, description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                household_id, room_id, category_id, name,
                asset_type, brand, model, serial_number,
                purchase_date, purchase_price, description
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/documents", async (req, res) => {
    try {
        const {
            household_id,
            asset_id,
            title,
            document_type,
            file_name,
            file_path,
            file_type,
            file_size,
            issue_date,
            expiry_date,
            ocr_text
        } = req.body;

        if (!household_id || !title || !document_type) {
            return res.status(400).json({
                error: "household_id, title and document_type are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO documents (
                household_id, asset_id, title, document_type,
                file_name, file_path, file_type, file_size,
                issue_date, expiry_date, ocr_text
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                household_id, asset_id, title, document_type,
                file_name, file_path, file_type, file_size,
                issue_date, expiry_date, ocr_text
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/warranties", async (req, res) => {
    try {
        const {
            asset_id,
            provider,
            warranty_number,
            start_date,
            end_date,
            coverage_details,
            document_id
        } = req.body;

        if (!asset_id || !provider || !start_date || !end_date) {
            return res.status(400).json({
                error: "asset_id, provider, start_date and end_date are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO warranties (
                asset_id, provider, warranty_number,
                start_date, end_date, coverage_details, document_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                asset_id, provider, warranty_number,
                start_date, end_date, coverage_details, document_id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/reminders", async (req, res) => {
    try {
        const {
            household_id,
            asset_id,
            title,
            description,
            due_date,
            reminder_type
        } = req.body;

        if (!household_id || !title || !due_date || !reminder_type) {
            return res.status(400).json({
                error: "Required fields are missing"
            });
        }

        const result = await pool.query(
            `INSERT INTO reminders (
                household_id, asset_id, title,
                description, due_date, reminder_type
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                household_id, asset_id, title,
                description, due_date, reminder_type
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/maintenance", async (req, res) => {
    try {
        const {
            asset_id,
            title,
            description,
            service_provider,
            service_date,
            cost,
            next_service_date,
            document_id
        } = req.body;

        if (!asset_id || !title || !service_date) {
            return res.status(400).json({
                error: "asset_id, title and service_date are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO maintenance_records (
                asset_id, title, description, service_provider,
                service_date, cost, next_service_date, document_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                asset_id, title, description, service_provider,
                service_date, cost, next_service_date, document_id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/rooms/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, room_type } = req.body;

        if (!name || !room_type) {
            return res.status(400).json({
                error: "name and room_type are required"
            });
        }

        const result = await pool.query(
            `UPDATE rooms
             SET name = $1,
                 room_type = $2,
                 updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [name, room_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Room not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/assets/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, model, purchase_price, description } = req.body;

        if (!name) {
            return res.status(400).json({
                error: "name is required"
            });
        }

        const result = await pool.query(
            `UPDATE assets
             SET name = $1,
                 brand = $2,
                 model = $3,
                 purchase_price = $4,
                 description = $5,
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [name, brand, model, purchase_price, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Asset not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/documents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            document_type,
            issue_date,
            expiry_date,
            ocr_text
        } = req.body;

        if (!title || !document_type) {
            return res.status(400).json({
                error: "title and document_type are required"
            });
        }

        const result = await pool.query(
            `UPDATE documents
             SET title = $1,
                 document_type = $2,
                 issue_date = $3,
                 expiry_date = $4,
                 ocr_text = $5,
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [
                title,
                document_type,
                issue_date,
                expiry_date,
                ocr_text,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/warranties/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            provider,
            warranty_number,
            start_date,
            end_date,
            coverage_details
        } = req.body;

        const result = await pool.query(
            `UPDATE warranties
             SET provider = $1,
                 warranty_number = $2,
                 start_date = $3,
                 end_date = $4,
                 coverage_details = $5
             WHERE id = $6
             RETURNING *`,
            [
                provider,
                warranty_number,
                start_date,
                end_date,
                coverage_details,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Warranty not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/reminders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            due_date,
            reminder_type
        } = req.body;

        const result = await pool.query(
            `UPDATE reminders
             SET title = $1,
                 description = $2,
                 due_date = $3,
                 reminder_type = $4
             WHERE id = $5
             RETURNING *`,
            [title, description, due_date, reminder_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/maintenance/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            service_provider,
            service_date,
            cost,
            next_service_date
        } = req.body;

        const result = await pool.query(
            `UPDATE maintenance_records
             SET title = $1,
                 description = $2,
                 service_provider = $3,
                 service_date = $4,
                 cost = $5,
                 next_service_date = $6
             WHERE id = $7
             RETURNING *`,
            [
                title,
                description,
                service_provider,
                service_date,
                cost,
                next_service_date,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE ROOMS
app.delete("/api/rooms/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM rooms WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Room not found" });

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE ASSETS
app.delete("/api/assets/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM assets WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Asset not found" });

        res.json({ message: "Asset deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE DOCUMENTS
app.delete("/api/documents/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM documents WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Document not found" });

        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE WARRANTIES
app.delete("/api/warranties/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM warranties WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Warranty not found" });

        res.json({ message: "Warranty deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE REMINDERS
app.delete("/api/reminders/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM reminders WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Reminder not found" });

        res.json({ message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE MAINTENANCE
app.delete("/api/maintenance/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM maintenance_records WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Maintenance record not found" });

        res.json({ message: "Maintenance deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});