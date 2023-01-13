import TrackPlayer from 'react-native-track-player';

export const addRadioTrack = async () => {
  await TrackPlayer.add([
    {
      url: 'http://mediaserv30.live-streams.nl:8086/live',
      type: 'hls',
      title: 'Radio',
      artist: 'Commentary',
      album: 'Live',
      genre: 'Drama',
    },
  ]);
};
