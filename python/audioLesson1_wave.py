import wave
from pathlib import Path
import os

def read_wav(source: str):
    with wave.open(source, 'rb') as wav_file:
        n_channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        framerate = wav_file.getframerate()
        n_frames = wav_file.getnframes()
        comp_type = wav_file.getcomptype()
        comp_name = wav_file.getcompname()

        frames = wav_file.readframes(n_frames)
        assert len(frames) == sample_width * n_frames
        audio_info = [n_channels, sample_width, framerate, n_frames, comp_type, comp_name, frames]
        print(audio_info[0:-1])
        return audio_info
    
def write_wav(params = []):
    
    if not params:
        raise Exception("no params for new wav file")


    dest = Path(__file__).parent / "temp"
    if not os.path.exists(dest):
        os.mkdir(dest, 555)
    filename = "output.wav"
    with wave.open(os.path.join(dest, filename), 'wb') as wav_file:
        frames = params[-1]
        wav_file.setparams(tuple(params[0:-1]))
        wav_file.writeframes(frames)

def reduce_wav_duration(params = [], start = 0, end = -1):
    if not params:
        return
    framerate, n_frames = params[2], params[3]
    audio_duration_s = n_frames / framerate
    print(f"audio duration: {int(audio_duration_s // 60)}:{int(audio_duration_s % 60)}")
    m = int(input("cut to:\nm:"))
    s = int(input("s:"))
    end = m * 60 + s
    if end > audio_duration_s:
        return

    params[-1] = params[-1][start:int(end * framerate)]
    params[3] = len(params[-1])
    write_wav(params)
reduce_wav_duration(read_wav("F:\\audio\\audio.wav"))