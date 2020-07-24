import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:swiftset/utils/exercise_database.dart';

import 'exercise_video.dart';

class SavedExercises extends StatefulWidget {
  @override
  _SavedExercisesState createState() => _SavedExercisesState();
}

class _SavedExercisesState extends State<SavedExercises> {
  List<Exercise> savedExercises = new List();

  @override
  Widget build(BuildContext context) {
    return SafeArea(child: _exerciseList());
  }

  @override
  @override
  void initState() {
    _getSavedExercises();
  }

  Widget _exerciseList() {
    return ListView.builder(
      itemCount: savedExercises.length,
      itemBuilder: (context, index) {
        final exercise = savedExercises[index];
        return _buildRow(exercise);
      },
    );
  }

  Widget _buildRow(Exercise exercise) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                ExerciseVideoScreen(exercise: exercise, saved: true),
          ),
        );
      },
      child: Hero(
        tag: 'exercise-' + exercise.id.toString(),
        child: ListTile(
          title: Text(exercise.name),
          trailing: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Image.asset('assets/images/swiftset.png'),
          ),
        ),
      ),
    );
  }

  void _getSavedExercises() async {
    final prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString('savedExercises') ?? '';
    var savedIds = savedExercisesString.split(',').toSet();
    var allExercises = await ExerciseDatabase.getAllExercises();
    setState(() {
      savedExercises = allExercises
          .where((e) => savedIds.contains(e.id.toString()))
          .toList();
    });
  }
}
