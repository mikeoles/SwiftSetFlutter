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

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _getSavedExercises(),
      builder: (BuildContext c, AsyncSnapshot<List<Exercise>> snapshot) {
        if (snapshot.hasData) {
          if(snapshot.data == null || snapshot.data!.isEmpty) {
            return _emptyMessage("No Saved Exercises");
          }
          return SafeArea(child: _exerciseList(snapshot.data ?? []));
        } else {
          return _emptyMessage("Loading Saved Exercises");
        }
      }
    );
  }

  @override
  void initState() {
    super.initState();
    _getSavedExercises();
  }

  Widget _exerciseList(List<Exercise> savedExercises) {
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
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                ExerciseVideoScreen(exercise: exercise, saved: true),
          ),
        );
        setState(() {
          _getSavedExercises();
        });
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

  Future<List<Exercise>> _getSavedExercises() async {
    final prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString('savedExercises') ?? '';
    var savedIds = savedExercisesString.split(',').toSet();
    var exercises = await ExerciseDatabase.getAllExercises();
    return exercises.where((e) => savedIds.contains(e.id.toString())).toList();
  }

  Widget _emptyMessage(String message) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Center(
          child: Text(message,
        style: TextStyle(fontSize: 24),
      )),
    );
  }
}
