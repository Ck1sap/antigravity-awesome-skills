# P0 Local Clip Factory

## Must ship
- [x] FastAPI job submit endpoint: POST /jobs
- [x] Celery worker job runner
- [x] faster-whisper transcription service
- [x] Scene detection service (PySceneDetect)
- [x] Clip scoring service (heuristic v1)
- [x] FFmpeg vertical render
- [x] SRT burn-in + plain SRT export
- [x] Output manifest clips.csv

## Acceptance
- [ ] Input: 3+ long videos in data/inbox
- [ ] Output: at least 10 ranked vertical clips/video in data/outbox
- [ ] Runtime: completes overnight unattended