import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../utils/constants';

interface Props {
  uri: string;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<Props> = ({ uri, onComplete }) => {
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const handlePlaybackStatusUpdate = (status: any) => {
    setStatus(status);
    if (status.didJustFinish && onComplete) {
      onComplete();
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        shouldPlay={false}
      />
      
      {!status.isLoaded && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {
                  width: `${((status.positionMillis || 0) / (status.durationMillis || 1)) * 100}%`
                }
              ]}
            />
          </View>
          <Text style={styles.duration}>
            {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const formatTime = (millis: number) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: 200
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay
  },
  loadingText: {
    ...FONTS.body3,
    color: '#fff'
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    backgroundColor: COLORS.surface
  },
  controlButton: {
    padding: SIZES.base,
    marginRight: SIZES.base
  },
  progressContainer: {
    flex: 1
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  duration: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: 4
  }
});

export default VideoPlayer;
