import 'dart:math';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class ExerciseVideoScreen extends StatefulWidget {
  final Exercise exercise;
  final bool saved;

  ExerciseVideoScreen({Key key, @required this.exercise, @required this.saved}) : super(key: key);

  @override
  _ExerciseVideoScreenState createState() => _ExerciseVideoScreenState();
}

class _ExerciseVideoScreenState extends State<ExerciseVideoScreen> {
  bool saved = false;

  @override
  void initState() {
    super.initState();
    saved = widget.saved;
  }

  @override
  Widget build(BuildContext context) {
    String videoId = YoutubePlayer.convertUrlToId(widget.exercise.url);
    int startTime = getStartTime(widget.exercise.url);

    YoutubePlayerController _controller = YoutubePlayerController(
      initialVideoId: videoId,
      flags: YoutubePlayerFlags(
        autoPlay: true,
        startAt: startTime,
      ),
    );

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            YoutubePlayer(
              controller: _controller,
              showVideoProgressIndicator: true,
            ),
            Hero(
              tag: 'exercise-' + widget.exercise.id.toString(),
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Center(
                  child: Text(widget.exercise.name),
                ),
              ),
            ),
            RaisedButton(
              onPressed: _saveExercise,
              child: saved ? Text('Unsave') : Text('Save Exercise')
            )
          ],
        ),
      ),
    );
  }

  int getStartTime(String selectedUrl) {
    String youtubeCode = "";
    int startTimeSeconds = 0;

    // Remove start of url - youtubeCode contains video code and possibly time/playlist info
    final String fullUrl = "youtube.com/watch?v=";
    final String shortUrl = "youtu.be/";
    if (selectedUrl.toLowerCase().contains(fullUrl)) {
      youtubeCode = selectedUrl
          .substring(selectedUrl.lastIndexOf(fullUrl) + fullUrl.length);
    } else if (selectedUrl.toLowerCase().contains(shortUrl)) {
      youtubeCode = selectedUrl
          .substring(selectedUrl.lastIndexOf(shortUrl) + shortUrl.length);
    }

    //Find the video code from the url
    //Ex: Url = https://www.youtube.com/watch?v=D5d_rkxPfuE&t=1m4s videoCode = D5d_rkxPfuE
    int endOfVideoCode = findFirstSeparator(youtubeCode);
    if ((youtubeCode.contains("&t=") || youtubeCode.contains("?t=")) &&
        (endOfVideoCode < youtubeCode.length)) {
      //removes the video code from the youtubeCode
      youtubeCode =
          youtubeCode.substring(endOfVideoCode + 1, youtubeCode.length);
      //Timecode is everything after t=
      int start = max(youtubeCode.indexOf("&t=") + 3, youtubeCode.indexOf("?t=") + 3);
      String timecode = youtubeCode.substring(start, youtubeCode.length);
      //and everything before the first seperator
      timecode = timecode.substring(0, findFirstSeparator(timecode));

      //Ex: t=1m5s&index=2&list=WL&index=3 -> 1m5s
      if (!timecode.contains("m") && !timecode.contains("s")) {
        //timecode is just listed as an interger of seconds (?t=166)
        startTimeSeconds = int.tryParse(timecode) ?? 0;
      }

      if (timecode.contains("m")) {
        var parts = timecode.split("m");
        parts[0] =
            parts[0].substring(0, parts[0].length - 1); // remove mL 2m -> 2
        startTimeSeconds = int.tryParse(parts[0]) ??
            0 * 60; //Convert the url minutes time to seconds
        if (parts.length > 1) {
          timecode = parts[1];
        }
      }

      if (timecode.contains("s")) {
        timecode =
            timecode.substring(0, timecode.length - 1); // remove s: 54s -> 54
        startTimeSeconds += int.tryParse(timecode) ?? 0;
      }
    }
    return startTimeSeconds;
  }

  int findFirstSeparator(String s) {
    int endOfVideoCode = s.length;
    if (s.contains("&")) {
      endOfVideoCode = min(endOfVideoCode, s.indexOf("&"));
    }
    if (s.contains("?")) {
      endOfVideoCode = min(endOfVideoCode, s.indexOf("?"));
    }
    if (s.contains("\n")) {
      endOfVideoCode = min(endOfVideoCode, s.indexOf("\n"));
    }
    return endOfVideoCode;
  }

  void _saveExercise() async {
    final prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString('savedExercises') ?? '';
    final savedExercises = savedExercisesString.split(',');
    final String id = widget.exercise.id.toString();

    if (saved) {
      savedExercises.remove(id);
    } else {
      savedExercises.add(id);
    }
    setState(() {
      saved = !saved;
    });

    prefs.setString('savedExercises', savedExercises.join(','));
  }
}
