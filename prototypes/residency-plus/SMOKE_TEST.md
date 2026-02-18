# RESIDENCY+ Smoke Test

## Start
- Set env var:
  - PowerShell: $env:SOUNDCLOUD_CLIENT_ID="YOUR_CLIENT_ID"
- Run:
  - 
etlify dev

## Open
- http://localhost:8888

## Function checks
- curl "http://localhost:8888/.netlify/functions/sc-search?q=test&kind=tracks"

## Expected behavior if missing/invalid CLIENT_ID
- Endpoint returns a clear error message (no server crash)
- UI shows a friendly notice or empty state