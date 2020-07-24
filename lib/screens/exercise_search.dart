import 'dart:math';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/exercise_video.dart';
import 'package:swiftset/screens/group_selection.dart';
import 'package:swiftset/utils/exercise_database.dart';

import '../models/exercise.dart';
import '../models/filter.dart';

class ExerciseFinder extends StatefulWidget {
  ExerciseFinderState efs;

  void addFilter() {
    efs.addFilter();
  }

  @override
  ExerciseFinderState createState() {
    efs = new ExerciseFinderState();
    return efs;
  }


}

class ExerciseFinderState extends State<ExerciseFinder> {
  SharedPreferences prefs;
  Set<String> savedIds = new Set();
  var allExercises = new List<Exercise>();
  var startingGroups = new List<FilterGroup>();
  var allFilters = new List<Filter>();
  var currentFilters = new List<Filter>();
  var currentGroups = new List<FilterGroup>();
  var filteredExercises = new List<Exercise>();
  var searchedExercises = new List<Exercise>();

  @override
  void initState() {
    _loadFromDatabase();
  }

  void _loadFromDatabase() async {
    prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString('savedExercises') ?? '';
    savedIds = savedExercisesString.split(',').toSet();

    allExercises = await ExerciseDatabase.getAllExercises();
    startingGroups = await ExerciseDatabase.getStartingFilterGroups();
    allFilters = await ExerciseDatabase.getAllFilters();

    setState(() {
      filteredExercises.addAll(allExercises);
      _filterHidden();
      searchedExercises.addAll(filteredExercises);
      currentGroups.addAll(startingGroups);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          _searchBar(),
          _filterList(),
          _exerciseList(),
        ],
      ),
    );
  }

  Widget _searchBar() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Row(
        children: [
          Expanded(
            child: TextFormField(
              onChanged: (searchText) {
                filterSearchResults(searchText);
              },
              style: new TextStyle(color: Colors.blue),
              decoration: new InputDecoration(
                contentPadding: new EdgeInsets.symmetric(vertical: 5.0),
                prefixIcon: Icon(Icons.search),
                labelText: "Search " +
                    searchedExercises.length.toString() +
                    " Exercises",
                border: new OutlineInputBorder(
                  borderRadius: new BorderRadius.circular(25.0),
                ),
              ),
            ),
          ),
          new IconButton(
            icon: Icon(Icons.shuffle, color: Colors.blue, size: 40),
            onPressed: () {
              final _random = new Random();
              var exercise = searchedExercises[_random.nextInt(searchedExercises.length)];
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ExerciseVideoScreen(
                      exercise: exercise,
                      saved: savedIds.contains(exercise.id.toString())),
                ),
              );
            },
          )
        ],
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
    List<Widget> filters =
        currentFilters.map((item) => _buildChip(item)).toList().cast<Widget>();
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
      child: ListView.separated(
        itemCount: searchedExercises.length,
        itemBuilder: (context, index) {
          final exercise = searchedExercises[index];
          return _buildRow(
              exercise, savedIds.contains(exercise.id.toString()));
        },
        separatorBuilder: (BuildContext context, int index) => Divider(
          thickness: 1,
          height: 1,
        ),
      ),
    );
  }

  Widget _buildRow(Exercise exercise, bool favorite) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ExerciseVideoScreen(
                exercise: exercise,
                saved: savedIds.contains(exercise.id.toString())),
          ),
        );
      },
      child: ListTile(
        title: Text(exercise.name),
        trailing: favorite
            ? Padding(
                padding: const EdgeInsets.all(12.0),
                child: Image.asset('assets/images/swiftset.png'),
              )
            : null,
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

  void addFilter() async {
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
      } else if (chosenFilter != null) {
        // returning list of filters from a multi selection
        List<Filter> multipleFilters = chosenFilter as List<Filter>;
        if (multipleFilters.isNotEmpty) {
          this
              .currentGroups
              .removeWhere((g) => g.id == multipleFilters[0].group.id);
          multipleFilters.forEach((f) => this.currentFilters.add(f));
          _filterExercises();
        }
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
    var exerciseValue = exercise.toMap()[filter.dbColumn
        .toLowerCase()]; // Value from the exercise to check against filter
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
    startingGroups.forEach((g) =>
        groups.putIfAbsent(g.id, () => g)); // start with all default groups
    currentFilters.forEach((f) {
      f.groupsToAdd.forEach((g) =>
          groups.putIfAbsent(g.id, () => g)); // add groups based on filters
    });
    currentFilters.forEach((f) {
      // remove groups that are already filtered
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
      List<Exercise> matchingExercises = filteredExercises
          .where((e) => _matchesFilter(e, multiFilters[i]))
          .toList();
      matchingExercises
          .forEach((e) => unqiueExercises.putIfAbsent(e.id, () => e));
      this.filteredExercises = unqiueExercises.values.toList();
    }
  }

  void _filterHidden() {
    String filterString = prefs.getString("4") + ',' + prefs.getString("5");
    Set filterIds = filterString.split(",").toSet();
    List<Filter> hiddenFilters =
        allFilters.where((f) => filterIds.contains(f.id.toString())).toList();
    hiddenFilters.forEach(
        (f) => this.filteredExercises.removeWhere((e) => _matchesFilter(e, f)));
    hiddenFilters.forEach(
        (f) => this.filteredExercises.removeWhere((e) => _matchesFilter(e, f)));
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
