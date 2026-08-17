import sqlite3

# Connect to SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect("checkpoints.sqlite3")
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS "checkpoints" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "tag" TEXT,
        "state" TEXT,
        "prev" TEXT
    )
"""
)

# Begin transaction (Python's sqlite3 does this automatically on write, 
# but explicit BEGIN can be simulated or handled via isolation level)
cursor.execute("BEGIN TRANSACTION")

# Test entries (uncomment to use):
# cursor.execute('INSERT INTO "checkpoints" ("tag", "state", "prev") VALUES (?, ?, ?)', ("tageswanderung", "99", "3000000"))
# cursor.execute('INSERT INTO "checkpoints" ("tag", "state", "prev") VALUES (?, ?, ?)', ("introwanderung", "5326", "3000000"))

# Delete all entries (uncomment to use):
# cursor.execute('DELETE FROM "checkpoints"')

# View table: fetch one row as a dictionary-like object
cursor.execute("SELECT * FROM checkpoints")

# To mimic SQLITE3_ASSOC (fetching columns as keys), use a row factory:
conn.row_factory = sqlite3.Row
# Re-run query with row_factory applied, or fetch from cursor
cursor.execute("SELECT * FROM checkpoints")
row = cursor.fetchone()

if row:
    # Convert row to dictionary to mimic var_dump/assoc array behavior
    print(dict(row))
else:
    print(None)

# Commit changes and close connection
conn.commit()
conn.close()
