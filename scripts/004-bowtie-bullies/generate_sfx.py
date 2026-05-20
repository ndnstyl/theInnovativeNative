#!/usr/bin/env python3
"""
Generate 4 missing SFX audio files for BowTie Bullies EP-001 pipeline.
Uses only numpy and scipy. Outputs 16-bit PCM WAV, 44100Hz, mono, -12dB peak.
"""

import os
import numpy as np
from scipy.io import wavfile

SAMPLE_RATE = 44100
DURATION = 10.0  # seconds
OUTPUT_DIR = "/Users/makwa/theinnovativenative/projects/004-bowtie-bullies/media/SFX"
CROSSFADE_MS = 50
TARGET_DB = -12.0  # peak level

num_samples = int(SAMPLE_RATE * DURATION)
t = np.linspace(0, DURATION, num_samples, endpoint=False)
crossfade_samples = int(SAMPLE_RATE * CROSSFADE_MS / 1000)


def normalize_to_db(signal, db):
    """Normalize signal peak to target dB level."""
    peak = np.max(np.abs(signal))
    if peak == 0:
        return signal
    target_amp = 10 ** (db / 20.0)
    return signal * (target_amp / peak)


def apply_loop_crossfade(signal, xfade_len):
    """Apply fade-in/out for seamless looping."""
    fade_in = np.linspace(0, 1, xfade_len)
    fade_out = np.linspace(1, 0, xfade_len)
    signal[:xfade_len] *= fade_in
    signal[-xfade_len:] *= fade_out
    return signal


def to_16bit(signal):
    """Convert float signal to 16-bit PCM."""
    signal = np.clip(signal, -1.0, 1.0)
    return (signal * 32767).astype(np.int16)


def save_wav(filename, signal):
    """Normalize, crossfade, convert, and save."""
    signal = normalize_to_db(signal, TARGET_DB)
    signal = apply_loop_crossfade(signal, crossfade_samples)
    path = os.path.join(OUTPUT_DIR, filename)
    wavfile.write(path, SAMPLE_RATE, to_16bit(signal))
    size = os.path.getsize(path)
    print(f"  {filename}: {size:,} bytes ({size/1024:.1f} KB)")
    return path


def pink_noise(n):
    """Generate approximate pink noise using spectral shaping."""
    white = np.random.randn(n)
    # Use FFT to shape spectrum: 1/sqrt(f)
    fft = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(n, 1.0 / SAMPLE_RATE)
    freqs[0] = 1  # avoid div by zero
    fft *= 1.0 / np.sqrt(freqs)
    return np.fft.irfft(fft, n)


def bandpass_noise(n, low, high, sr=SAMPLE_RATE):
    """Generate band-pass filtered white noise via FFT."""
    white = np.random.randn(n)
    fft = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(n, 1.0 / sr)
    mask = np.zeros_like(freqs)
    mask[(freqs >= low) & (freqs <= high)] = 1.0
    # Smooth edges to avoid ringing
    transition = 50  # Hz
    for edge, side in [(low, 'low'), (high, 'high')]:
        if side == 'low':
            band = (freqs >= max(0, edge - transition)) & (freqs < edge)
            if np.any(band):
                mask[band] = np.linspace(0, 1, np.sum(band))
        else:
            band = (freqs > edge) & (freqs <= edge + transition)
            if np.any(band):
                mask[band] = np.linspace(1, 0, np.sum(band))
    fft *= mask
    return np.fft.irfft(fft, n)


# ---------- 1. sub_bass_hum.wav ----------
def gen_sub_bass_hum():
    print("Generating sub_bass_hum.wav...")
    # 40Hz sine + 55Hz sine (slightly detuned for movement)
    bass_40 = np.sin(2 * np.pi * 40 * t)
    bass_55 = 0.6 * np.sin(2 * np.pi * 55 * t)
    # Slow LFO on amplitude (0.3Hz breathing)
    lfo = 0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t)
    signal = (bass_40 + bass_55) * lfo
    # Very quiet pink noise at -30dB relative
    noise = pink_noise(num_samples)
    noise_level = 10 ** (-30 / 20.0)
    noise = noise / np.max(np.abs(noise)) * noise_level
    signal += noise
    save_wav("sub_bass_hum.wav", signal)


# ---------- 2. wind_chainlink.wav ----------
def gen_wind_chainlink():
    print("Generating wind_chainlink.wav...")
    # Band-pass filtered white noise (200-2000Hz)
    base_noise = bandpass_noise(num_samples, 200, 2000)
    # Resonant peaks at 800Hz and 1600Hz (chain-link rattle)
    rattle_800 = bandpass_noise(num_samples, 750, 850) * 0.4
    rattle_1600 = bandpass_noise(num_samples, 1550, 1650) * 0.3
    # Slow amplitude modulation (0.5Hz gusts)
    gust = 0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * t + np.random.uniform(0, 2 * np.pi))
    signal = (base_noise + rattle_800 + rattle_1600) * gust
    # Quiet high-freq whistle at 3kHz
    whistle_level = 10 ** (-25 / 20.0)
    whistle = whistle_level * np.sin(2 * np.pi * 3000 * t)
    # Slight whistle wavering
    whistle *= (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * t))
    signal += whistle
    save_wav("wind_chainlink.wav", signal)


# ---------- 3. building_hallway.wav ----------
def gen_building_hallway():
    print("Generating building_hallway.wav...")
    # 60Hz hum + 120Hz harmonic (electrical hum)
    hum_60 = np.sin(2 * np.pi * 60 * t)
    hum_120 = 0.3 * np.sin(2 * np.pi * 120 * t)
    hum_180 = 0.1 * np.sin(2 * np.pi * 180 * t)  # third harmonic
    hum = hum_60 + hum_120 + hum_180
    # Very slow amplitude drift
    drift = 0.85 + 0.15 * np.sin(2 * np.pi * 0.1 * t)
    hum *= drift
    # Quiet broadband noise floor at -35dB
    noise_level = 10 ** (-35 / 20.0)
    noise = np.random.randn(num_samples)
    noise = noise / np.max(np.abs(noise)) * noise_level
    # Low-pass the noise floor to simulate indoor absorption
    fft = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(num_samples, 1.0 / SAMPLE_RATE)
    # Roll off above 2kHz
    rolloff = np.ones_like(freqs)
    high = freqs > 2000
    rolloff[high] = np.exp(-(freqs[high] - 2000) / 1000)
    fft *= rolloff
    noise = np.fft.irfft(fft, num_samples)
    # Subtle resonance shift (very slow filter sweep)
    resonance = 0.05 * np.sin(2 * np.pi * 250 * t) * np.sin(2 * np.pi * 0.05 * t)
    signal = hum + noise + resonance
    save_wav("building_hallway.wav", signal)


# ---------- 4. data_stream_hum.wav ----------
def gen_data_stream_hum():
    print("Generating data_stream_hum.wav...")
    # Two detuned sines for beating (440 + 443 Hz = 3Hz beat)
    tone_a = np.sin(2 * np.pi * 440 * t)
    tone_b = 0.9 * np.sin(2 * np.pi * 443 * t)
    # Higher harmonics (very quiet)
    harm_880 = 0.15 * np.sin(2 * np.pi * 880 * t)
    harm_1320 = 0.08 * np.sin(2 * np.pi * 1320 * t)
    # FM modulation for digital texture
    mod_freq = 7.0  # modulation rate
    mod_depth = 5.0  # Hz deviation
    fm_carrier = 0.3 * np.sin(2 * np.pi * 660 * t + mod_depth * np.sin(2 * np.pi * mod_freq * t))
    # Subtle amplitude pulsing
    pulse = 0.9 + 0.1 * np.sin(2 * np.pi * 1.5 * t)
    signal = (tone_a + tone_b + harm_880 + harm_1320 + fm_carrier) * pulse
    save_wav("data_stream_hum.wav", signal)


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}\n")
    gen_sub_bass_hum()
    gen_wind_chainlink()
    gen_building_hallway()
    gen_data_stream_hum()
    print("\nAll 4 SFX files generated successfully.")
