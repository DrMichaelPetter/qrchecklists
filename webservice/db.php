<?php
$db = new SQLite3('db/checkpoints.sqlite3', SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);
$db->query('CREATE TABLE IF NOT EXISTS "checkpoints" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "tag" VARCHAR,
    "state" VARCHAR,
    "prev" VARCHAR
)');

$db->exec('BEGIN');

//test entries:
//$db->query('INSERT INTO "checkpoints" ("tag", "state", "prev") VALUES ("tageswanderung", "99","3000000")');
//$db->query('INSERT INTO "checkpoints" ("tag", "state", "prev") VALUES ("introwanderung", "5326","3000000")');

// delete all entries, resetting the server-side stuff
//$db->query('DELETE FROM "checkpoints"');

// view table:
$q=$db->query('SELECT * FROM checkpoints');
var_dump($q->fetchArray(SQLITE3_ASSOC));

$db->exec('COMMIT');
$db->close();
?>