import 'package:flutter/material.dart';
import 'package:swiftset/screens/exercise_video.dart';
import 'package:swiftset/utils/exercise_database.dart';

import 'models/exercise.dart';
import 'models/filter_category.dart';

List<Exercise> allExercises;

void main() async {
  allExercises = await ExerciseDatabase.getAllExercises();
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
  var currentExercises = new List<Exercise>();

  @override
  void initState() {
    currentExercises.addAll(allExercises);
    super.initState();
  }

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
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => {},
        tooltip: 'Increment Counter',
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _searchBar() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: TextFormField(
        onChanged: (searchText) {
          filterSearchResults(searchText);
        },
        decoration: new InputDecoration(
          prefixIcon: Icon(Icons.search),
          labelText: "Search " + currentExercises.length.toString() + " Exercises",
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
        itemCount: currentExercises.length,
        itemBuilder: (context, index) {
          final exercise = currentExercises[index];
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

  void filterSearchResults(String query) {
    if(query.isNotEmpty) {
      setState(() {
        currentExercises = allExercises.where((i) => i.name.toLowerCase().contains(query)).toList();
      });
      return;
    } else {
      setState(() {
        currentExercises.clear();
        currentExercises.addAll(allExercises);
      });
    }
  }
}
