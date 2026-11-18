# Moon XR — backups

- `db/moonxr-YYYY-MM-DD.dump.gpg`: the whole database, encrypted (the last 30 nights).
- `media/`: every photo and video uploaded from /admin.

## Restore the database
1. Decrypt (asks for the BACKUP_PASSPHRASE):
   `gpg -o moonxr.dump -d db/moonxr-YYYY-MM-DD.dump.gpg`
2. Load it into a Supabase project (PostgreSQL 17 client):
   `pg_restore --clean --if-exists --no-owner -d "<connection string>" moonxr.dump`
