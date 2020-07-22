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
  SwiftSet();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Home(),
    );
  }
}

class Home extends StatefulWidget {
  Home();

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  var currentFilters = new List<Filter>();
  var currentGroups = new List<FilterGroup>();
  var filteredExercises = new List<Exercise>();
  var searchedExercises = new List<Exercise>();
  int _selectedIndex = 0;

  @override
  void initState() {
    filteredExercises.addAll(allExercises);
    searchedExercises.addAll(allExercises);
    currentGroups.addAll(startingGroups);
    super.initState();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            title: Text('Search'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            title: Text('Saved'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            title: Text('Settings'),
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blueAccent,
        onTap: _onItemTapped,
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
      backgroundColor: ExerciseDatabase.hexToColor(filter.group.color),
      deleteIcon: Icon(Icons.close, color: Colors.white, size: 12),
      onDeleted: () {
        setState(() {
          currentFilters.remove(filter);
          _updateGroups();
          _filterExercises();
        });
      },
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _buildClearAllChip() {
    return Chip(
      label: Text(
        "Clear All",
        style: TextStyle(
          color: Colors.white,
        ),
      ),
      backgroundColor: Colors.redAccent,
      onDeleted: () {
        setState(() {
          currentFilters.clear();
          _updateGroups();
          _filterExercises();
        });
      },
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _filterList() {
    List<Widget> filters = currentFilters
        .map((item) => _buildChip(item))
        .toList()
        .cast<Widget>();
    if (filters.length > 1) {
      filters.add(_buildClearAllChip());
    }
    return Wrap(
      spacing: 5.0,
      runSpacing: 5.0,
      children: filters,
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
      child: Hero(
        tag: 'exercise-' + exercise.id.toString(),
        child: Card(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Center(
              child: Text(exercise.name),
            ),
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
    var chosenFilter = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GroupSelectionScreen(filterGroups: currentGroups),
      ),
    );
    setState(() {
      if (chosenFilter.runtimeType == Filter) {
        Filter filter = chosenFilter as Filter;
        this.currentGroups.removeWhere((g) => g.id == filter.group.id);
        this.currentGroups.addAll(filter.groupsToAdd);
        this.currentFilters.add(chosenFilter);
        _filterExercises();
      } else { // returning list of filters from a multi selection
        List<Filter> multipleFilters = chosenFilter as List<Filter>;
        this.currentGroups.removeWhere((g) => g.id == multipleFilters[0].group.id);
        multipleFilters.forEach((f) => this.currentFilters.add(f));
        _filterExercises();
      }
    });
  }

  void _filterExercises() {
    this.filteredExercises.clear();
    this.searchedExercises.clear();
    this.filteredExercises.addAll(allExercises);
    _filterMulti();
    _filterSingle();
    this.searchedExercises.addAll(this.filteredExercises);
  }

  // Determine if an exercise should be removed by a filter
  bool _matchesFilter(Exercise exercise, Filter filter) {
    var exerciseValue = exercise.toMap()[filter.dbColumn.toLowerCase()]; // Value from the exercise to check against filter
    if (exerciseValue == null) {
      return false;
    }
    exerciseValue = exerciseValue.toLowerCase();
    var filterValue = filter.dbSortBy.toLowerCase();

    if (filterValue.contains('/')) {
      // Used when multiple values are acceptable (Ex: chest, triceps both acceptable primary values for Push)
      return filterValue.split('/').any((e) => exerciseValue.contains(e));
    } else {
      return exerciseValue.contains(filterValue);
    }
  }

  void _updateGroups() {
    Map<int, FilterGroup> groups = Map(); // make sure no group is duplicated
    startingGroups.forEach((g) => groups.putIfAbsent(g.id, () => g)); // start with all default groups
    currentFilters.forEach((f) {
      f.groupsToAdd.forEach((g) => groups.putIfAbsent(g.id, () => g)); // add groups based on filters
    });
    currentFilters.forEach((f) { // remove groups that are already filtered
      groups.remove(f.id);
    });
    currentGroups.clear();
    currentGroups.addAll(groups.values.toList());
  }

  void _filterMulti() {
    List<Filter> multiFilters =
        currentFilters.where((f) => f.group.isMultiChoice).toList();
    Map<int, Exercise> unqiueExercises = Map();
    for (int i = 0; i < multiFilters.length; i++) {
      List<Exercise> matchingExercises = allExercises
          .where((e) => _matchesFilter(e, multiFilters[i]))
          .toList();
      matchingExercises
          .forEach((e) => unqiueExercises.putIfAbsent(e.id, () => e));
      this.filteredExercises = unqiueExercises.values.toList();
    }
  }

  void _filterSingle() {
    List<Filter> singleFilters =
        currentFilters.where((f) => !f.group.isMultiChoice).toList();
    singleFilters.forEach((f) => {
          this.filteredExercises =
              this.filteredExercises.where((e) => _matchesFilter(e, f)).toList()
        });
  }
}
