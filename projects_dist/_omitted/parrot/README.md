# Parrot
Voice detection based recorder, will play back your sentence whenever you stop speaking.

## How it works
Uses puppeteer to spawn a browser instance and launches an https server to get access to access some useful APIs:
- MediaRecorder (to access the microphone)
- AudioContext (to playback the sounds)
- SpeechRecognition (to get to know when the user starts/stops speaking)

## Launch
Launch with the `yarn start` command.

