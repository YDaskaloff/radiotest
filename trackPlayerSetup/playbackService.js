import TrackPlayer, {Event, State} from 'react-native-track-player';

let wasPausedByDuck = false;

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    // after first remote interruption of the stream it is not starting with Trackplayer.play()
    // instead of this it needs TrackPlayer.skipToNext() or TrackPlayer.skipToPrevious() to continue
    TrackPlayer.play();
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
    const position = (await TrackPlayer.getPosition()) + event.interval;
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
    const position = (await TrackPlayer.getPosition()) - event.interval;
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, event => {
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async ({permanent, paused}) => {
      if (permanent) {
        TrackPlayer.pause();
        return;
      }
      if (paused) {
        const playerState = await TrackPlayer.getState();
        wasPausedByDuck = playerState !== State.Paused;
        TrackPlayer.pause();
      } else if (wasPausedByDuck) {
        // after first remote interuption of the stream it is not starting with Trackplayer.play()
        // instead of this it needs TrackPlayer.skipToNext() or TrackPlayer.skipToPrevious() to continue
        TrackPlayer.play();
        TrackPlayer.skipToNext();
        wasPausedByDuck = false;
      }
    },
  );
};
