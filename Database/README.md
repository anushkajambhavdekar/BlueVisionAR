# 3DVerse Database

This folder stores the MySQL database setup files for the project.

## Files

- `mysql-schema.sql`: Creates the `3dverse` database, creates the `object_catalog` table, and inserts the initial 3D object records with descriptions.

## Import Into MySQL

Run this from the project root after MySQL is installed and running:

```powershell
mysql -u root -p < Database/mysql-schema.sql
```

The backend connects to this database using:

```text
Backend/.env
```

Current database config:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_NAME=3dverse
```

## Important

MySQL stores its live data files in the MySQL server data directory, not directly in this folder. This folder stores the project-owned schema and seed data used to create or recreate the database.
