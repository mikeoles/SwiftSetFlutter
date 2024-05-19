import 'dart:math';

import 'package:flutter/material.dart';
import 'package:share/share.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class ExerciseVideoScreen extends StatefulWidget {
  final Exercise exercise;
  final bool saved;

  ExerciseVideoScreen({required this.exercise, required this.saved});

  @override
  _ExerciseVideoScreenState createState() => _ExerciseVideoScreenState();
}

class _ExerciseVideoScreenState extends State<ExerciseVideoScreen> {
  bool saved = false; //

  @override
  void initState() {
    super.initState();
    saved = widget.saved;
  }

  @override
  Widget build(BuildContext context) {
    String? videoIdNullable = widget.exercise.url != null ? YoutubePlayer.convertUrlToId(widget.exercise.url!) : null;
    String videoId = videoIdNullable ?? '';

    int startTime = getStartTime(widget.exercise.url);

    if(videoId == '') {
      Navigator.pop(context, 'Exercise Video Not Found');
    }

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _title(),
            _videoPlayer(videoId, startTime),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _saveButton(),
                _openInBrowserButton(),
                _shareButton(),
              ],
            ),
            _exerciseInfo(),
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

  void _shareExercise() async {
    Share.share("Check out this exercise I found on the SwiftSet app: " + widget.exercise.name + " - " + widget.exercise.url);
  }

  // Change number to readable string
  String _difficultyText(String difficulty) {
    switch(difficulty) {
      case "1": {  return "Beginner"; }
      break;

      case "2": {  return "Intermediate"; }
      break;

      case "3": {  return "Experienced"; }
      break;

      case "4": {  return "Advanced"; }
      break;

      default: { return "Unknown"; }
      break;
    }
  }

  Widget _videoPlayer(String videoId, int startTime) {
    return YoutubePlayer(
      controller:  YoutubePlayerController(
        initialVideoId: videoId,
        flags: YoutubePlayerFlags(
          autoPlay: true,
          startAt: startTime,
        ),
      ),
      showVideoProgressIndicator: true,
    );
  }

  Widget _title() {
    return Row(
      children: [
        BackButton(),
        Expanded(
          child: Center(
            child: Container(
              width: MediaQuery.of(context).size.width,
              height: 80,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(4, 24, 24, 24),
                child: FittedBox(
                    fit: BoxFit.contain,
                    child: Text(widget.exercise.name)
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _backButton() {
    return BackButton();
  }


  Widget _saveButton() {
    var labelText = saved ? "Unsave" : "Save";
    var iconType = saved ? Icons.close : Icons.favorite;
    return Padding(
      padding: const EdgeInsets.only(top: 18.0),
      child: OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(
            vertical: 10.0,
            horizontal: 30.0,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)
          ),
          side: BorderSide(width: 5.0, color: Colors.blue),
          backgroundColor: Colors.blue
        ),
        icon: new IconTheme(
          data: new IconThemeData(
              color: Colors.white),
          child: new Icon(iconType, size: 18),
        ),
        label: Text(
          labelText,
          style: TextStyle(color: Colors.white),
        ),
        onPressed: _saveExercise,
      ),
    );
  }

  Widget _shareButton() {
    return Padding(
      padding: const EdgeInsets.only(top: 18.0),
      child: OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(
            vertical: 10.0,
            horizontal: 30.0,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)
          ),
          side: BorderSide(width: 5.0, color: Colors.blue),
          backgroundColor: Colors.blue
        ),
        icon: new IconTheme(
          data: new IconThemeData(
              color: Colors.white),
          child: new Icon(Icons.share, size: 18),
        ),
        label: Text(
          'Share',
          style: TextStyle(color: Colors.white),
        ),
        onPressed: _shareExercise,
      ),
    );
  }

  Widget _openInBrowserButton() {
    return Padding(
      padding: const EdgeInsets.only(top: 18.0),
      child: OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(
            vertical: 10.0,
            horizontal: 30.0,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)
          ),
          side: BorderSide(width: 5.0, color: Colors.blue),
            backgroundColor: Colors.blue
        ),
        icon: new IconTheme(
          data: new IconThemeData(
              color: Colors.white),
          child: new Icon(Icons.open_in_browser, size: 18),
        ),
        label: Text(
          'Watch',
          style: TextStyle(color: Colors.white),
        ),
        onPressed: _launchURL,
      ),
    );
  }

  Widget _exerciseInfo() {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(top: 28.0),
        child: ListView(
          children: <Widget>[
            ListTile(
              leading: Image.asset('assets/images/muscle.png',
                color: Colors.blue,),
              title: Text("Muscle Group"),
              subtitle: Text(widget.exercise.primary),
            ),
            ListTile(
              leading: Image.asset('assets/images/equipment.png',
                color: Colors.blue,),
              title: Text("Equipment"),
              subtitle: Text(widget.exercise.equipment.replaceAll("/", ", ")),
            ),
            ListTile(
              leading: Image.asset('assets/images/tempo.png',
                color: Colors.blue,),
              title: Text("Tempo"),
              subtitle: Text(widget.exercise.tempo.replaceAll("/", ", ")),
            ),
            ListTile(
              leading: Image.asset('assets/images/difficulty.png',
                color: Colors.blue,),
              title: Text("Difficulty"),
              subtitle: Text(_difficultyText(widget.exercise.difficulty)),
            ),
          ],
        ),
      ),
    );
  }

  void _launchURL() async {
    try {
      await launch(widget.exercise.url);
    } catch(e) {
      throw 'Could not launch ' + widget.exercise.url;
    }
  }
}
