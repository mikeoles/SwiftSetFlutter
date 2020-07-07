import 'package:flutter/material.dart';
import 'package:swiftset/screens/exercise_video.dart';
import 'package:swiftset/utils/exercise_database.dart';

import 'models/exercise.dart';
import 'models/filter_category.dart';

List<Exercise> exercises;

void main() async {
  exercises = await ExerciseDatabase.getAllExercises();
  runApp(SwiftSet());
}

class SwiftSet extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Home(),
    );
  }
}

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final currentFilters = new List<FilterCategory>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
            child: Column(
      children: [
        _searchBar(),
        _filterList(),
        _exerciseList(),
      ],
    )));
  }

  Widget _searchBar() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: TextFormField(
        decoration: new InputDecoration(
          prefixIcon: Icon(Icons.search),
          labelText: "Search " + exercises.length.toString() + " Exercises",
          border: new OutlineInputBorder(
            borderRadius: new BorderRadius.circular(25.0),
          ),
        ),
      ),
    );
  }

  Widget _buildChip(FilterCategory filterCategory) {
    return Chip(
      label: Text(
        filterCategory.name,
        style: TextStyle(
          color: Colors.white,
        ),
      ),
      backgroundColor: Colors.blueAccent,
      deleteIcon: Icon(Icons.close, color: Colors.white, size: 12),
      onDeleted: () {
        setState(() {
          currentFilters.remove(filterCategory);
        });
      },
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _filterList() {
    return Wrap(
      spacing: 5.0,
      runSpacing: 5.0,
      children: currentFilters
          .map((item) => _buildChip(item))
          .toList()
          .cast<Widget>(),
    );
  }

  Widget _exerciseList() {
    return Expanded(
      child: ListView.builder(
        itemCount: exercises.length,
        itemBuilder: (context, index) {
          final exercise = exercises[index];
          return _buildRow(exercise);
        },
      ),
    );
  }

  Widget _buildRow(Exercise exercise) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ExerciseVideoScreen(exercise: exercise),
          ),
        );
        setState(() {
          currentFilters.add(new FilterCategory(1, exercise.name));
        });
      },
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text(exercise.name),
          ),
        ),
      ),
    );
  }
}
