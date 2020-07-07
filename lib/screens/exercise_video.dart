import 'package:flutter/material.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class ExerciseVideoScreen extends StatelessWidget {
  final Exercise exercise;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  YoutubePlayerController _controller;

  ExerciseVideoScreen({Key key, @required this.exercise}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    YoutubePlayerController _controller = YoutubePlayerController(
      initialVideoId: 'iLnmTe5Q2Qw',
      flags: YoutubePlayerFlags(
        autoPlay: true,
        mute: true,
      ),
    );

    return YoutubePlayer(
      controller: _controller,
      showVideoProgressIndicator: true,
    );
  }
}
