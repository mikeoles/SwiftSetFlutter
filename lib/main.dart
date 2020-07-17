import 'package:flutter/material.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/exercise_video.dart';
import 'package:swiftset/screens/group_selection.dart';
import 'package:swiftset/utils/exercise_database.dart';

import 'models/exercise.dart';
import 'models/filter.dart';

List<Exercise> allExercises;
List<FilterGroup> startingGroups;

void main() async {
  allExercises = await ExerciseDatabase.getAllExercises();
  startingGroups = await ExerciseDatabase.getStartingFilterGroups();
  runApp(SwiftSet());
}

class SwiftSet extends StatelessWidget {
  Filter filter;

  SwiftSet({this.filter});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Home(this.filter),
    );
  }
}

class Home extends StatefulWidget {
  Filter filter;

  Home(this.filter);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  var currentFilters = new List<Filter>();
  var currentGroups = new List<FilterGroup>();
  var filteredExercises = new List<Exercise>();
  var searchedExercises = new List<Exercise>();

  @override
  void initState() {
    if (widget.filter != null) {
      {
        currentFilters.add(widget.filter);
      }
    }
    filteredExercises.addAll(allExercises);
    searchedExercises.addAll(allExercises);
    currentGroups.addAll(startingGroups);
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
        onPressed: _addFilter,
        tooltip: 'Increment Counter',
        child: const Icon(Icons.filter_list),
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
          labelText:
              "Search " + searchedExercises.length.toString() + " Exercises",
          border: new OutlineInputBorder(
            borderRadius: new BorderRadius.circular(25.0),
          ),
        ),
      ),
    );
  }

  Widget _buildChip(Filter filter) {
    return Chip(
      label: Text(
        filter.name,
        style: TextStyle(
          color: Colors.white,
        ),
      ),
      backgroundColor: Colors.blueAccent,
      deleteIcon: Icon(Icons.close, color: Colors.white, size: 12),
      onDeleted: () {
        setState(() {
          currentFilters.remove(filter);
          _updateGroups(filter);
          _filterExercises();
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
        itemCount: searchedExercises.length,
        itemBuilder: (context, index) {
          final exercise = searchedExercises[index];
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
    if (query.isNotEmpty) {
      setState(() {
        searchedExercises = allExercises
            .where((i) => i.name.toLowerCase().contains(query))
            .toList();
      });
      return;
    } else {
      setState(() {
        searchedExercises.clear();
        searchedExercises.addAll(filteredExercises);
      });
    }
  }

  void _addFilter() async {
    final Filter chosenFilter = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GroupSelectionScreen(filterGroups: currentGroups),
      ),
    );
    setState(() {
      this.currentGroups.removeWhere((g) => g.id == chosenFilter.group.id);
      this.currentFilters.add(chosenFilter);
      _filterExercises();
    });
  }

  void _filterExercises() {
    this.filteredExercises.clear();
    this.searchedExercises.clear();
    this.filteredExercises.addAll(allExercises);
    this.currentFilters.forEach((f) => {
      this.filteredExercises = this.filteredExercises.where((e) => _matchesFilter(e,f)).toList()
    });
    this.searchedExercises.addAll(this.filteredExercises);
  }

  // Determine if an exercise should be removed by a filter
  bool _matchesFilter(Exercise exercise, Filter filter) {
    var exerciseValue = exercise.toMap()[filter.dbColumn.toLowerCase()]; // Value from the exercuse to check against filter
    if (exerciseValue==null) {
      return false;
    }
    exerciseValue = exerciseValue.toLowerCase();
    var filterValue = filter.dbSortBy.toLowerCase();


    if (filterValue.contains('/')) { // Used when multiple values are acceptable (Ex: chest, triceps both acceptable primary values for Push)
      return filterValue.split('/').any((e) => exerciseValue.contains(e));
    } else {
      return exerciseValue.contains(filterValue);
    }
  }

  void _updateGroups(Filter filter) {
    if (!currentFilters.any((f) => f.group.id == filter.group.id)) {
      this.currentGroups.add(filter.group);
    }
  }
}
