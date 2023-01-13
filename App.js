import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {streamSetupService} from './trackPlayerSetup/streamSetupService';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import {addRadioTrack} from './trackPlayerSetup/addTrack';

const isAndroid = Platform.OS === 'android';

const App = () => {
  const playbackState = usePlaybackState();
  const isOn = playbackState === State.Playing;

  const setupRadio = async () => {
    const isSetup = await streamSetupService();
    const queue = await TrackPlayer.getQueue();

    if (isSetup && queue.length <= 0) {
      await addRadioTrack();
    }
  };

  const playRadio = () => {
    // after first remote interruption of the stream it is not starting with Trackplayer.play()
    // instead of this it needs TrackPlayer.skipToNext() or TrackPlayer.skipToPrevious() to continue
    TrackPlayer.play();
    // TrackPlayer.skipToNext();
  };

  const toggleRadio = async () => {
    if (isOn) {
      TrackPlayer.pause();
      isAndroid && TrackPlayer.reset();
    } else {
      playRadio();
    }
  };

  useEffect(() => {
    setupRadio();
  }, []);

  console.log('+++', {playbackState});

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Text>RADIO</Text>
      <TouchableOpacity
        style={[styles.button, isOn ? styles.buttonPause : styles.buttonPlay]}
        onPress={toggleRadio}>
        <Text style={styles.buttonTitle}>{isOn ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonPlay: {
    backgroundColor: 'green',
  },
  buttonPause: {
    backgroundColor: 'red',
  },
  buttonTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});

export default App;
