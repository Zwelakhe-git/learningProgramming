## using ‘+’ with audio
```python
from pydub import AudioSegment
combined = AudioSegment.empty()

audio_paths = []
for audio_file in audio_paths:
    seg = AudioSegment.from_mp3(audio_file)
    pause = AudioSegment.silent(duration=0)
    combined += seg + pause

conbined.export(outpath, format=“mp3”)
```
