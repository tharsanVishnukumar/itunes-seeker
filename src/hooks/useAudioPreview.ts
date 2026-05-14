import { Audio, type AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAudioPreviewState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAudioPreviewApi extends UseAudioPreviewState {
  toggle: () => Promise<void>;
  stop: () => Promise<void>;
}

let isAudioModeConfigured = false;

const ensureAudioMode = async (): Promise<void> => {
  if (isAudioModeConfigured) {
    return;
  }
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    isAudioModeConfigured = true;
  } catch (error) {
    console.warn("[useAudioPreview] setAudioModeAsync failed", error);
  }
};

export const useAudioPreview = (uri: string | undefined): UseAudioPreviewApi => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<UseAudioPreviewState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  });

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    if (!sound) {
      return;
    }
    try {
      await sound.unloadAsync();
    } catch (error) {
      console.warn("[useAudioPreview] unloadAsync failed", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      void unload();
    };
  }, [unload]);

  useEffect(() => {
    void unload();
    setState({ isPlaying: false, isLoading: false, error: null });
  }, [uri, unload]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        const message = status.error;
        setState((prev) => ({ ...prev, error: message, isPlaying: false }));
      }
      return;
    }
    setState((prev) => ({
      ...prev,
      isPlaying: status.isPlaying,
      error: null,
    }));
    if (status.didJustFinish) {
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const toggle = useCallback(async () => {
    if (!uri) {
      return;
    }
    try {
      await ensureAudioMode();

      if (!soundRef.current) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate,
        );
        soundRef.current = sound;
        setState((prev) => ({ ...prev, isLoading: false, isPlaying: true }));
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        return;
      }

      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setState((prev) => ({ ...prev, isPlaying: false }));
      } else {
        if (status.didJustFinish || status.positionMillis >= (status.durationMillis ?? 0)) {
          await soundRef.current.setPositionAsync(0);
        }
        await soundRef.current.playAsync();
        setState((prev) => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lecture audio impossible";
      setState({ isPlaying: false, isLoading: false, error: message });
    }
  }, [uri, onPlaybackStatusUpdate]);

  const stop = useCallback(async () => {
    await unload();
    setState({ isPlaying: false, isLoading: false, error: null });
  }, [unload]);

  return { ...state, toggle, stop };
};
