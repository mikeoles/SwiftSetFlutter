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
  bool sortedAlpha = true; // can be sorted alphabetically or by newest (highest id)
  SharedPreferences prefs;
  Set<String> savedIds = new Set(); // Ids of saved exercises
  var startingGroups = new List<FilterGroup>(); // Groups added by default
  var currentGroups = new List<FilterGroup>(); // Groups available based on filter selections
  var allFilters = new List<Filter>();
  var currentFilters = new List<Filter>();
  var allExercises = new List<Exercise>();
  var filteredExercises = new List<Exercise>();
  var searchedExercises = new List<Exercise>();

  @override
  void initState() {
    super.initState();
    _loadFromDatabase();
  }

  // setup the starting state of the exercise search
  void _loadFromDatabase() async {
    prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString('savedExercises') ?? '';
    savedIds = savedExercisesString.split(',').toSet();

    allExercises = await ExerciseDatabase.getAllExercises();
    allExercises.sort((a,b) => a.name.compareTo(b.name));
    startingGroups = await ExerciseDatabase.getStartingFilterGroups();
    allFilters = await ExerciseDatabase.getAllFilters();

    setState(() {
      filteredExercises.clear();
      searchedExercises.clear();
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
          _topBar(),
          _filterList(),
          _exerciseList(),
        ],
      ),
    );
  }

  Widget _topBar() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Row(
        children: [
          _searchBar(),
          IconButton(
            icon: Icon(Icons.sort, color: Colors.blue, size: 40),
            onPressed: () => _changeSorting(),
          ),
          IconButton(
            icon: Icon(Icons.shuffle, color: Colors.blue, size: 40),
            onPressed: () => _openRandomExercise(),
          ),
        ],
      ),
    );
  }

  Widget _searchBar() {
    return Expanded(
      child: TextFormField(
        onChanged: (searchText) {
          _filterSearchResults(searchText);
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
    );
  }

  Widget _filterList() {
    List<Widget> filters =
    currentFilters.map((item) => _buildChip(item)).toList().cast<Widget>();
    if (filters.length > 1) {
      filters.add(_buildChip(null));
    }
    return Wrap(
      spacing: 5.0,
      runSpacing: 5.0,
      children: filters,
    );
  }

  Widget _buildChip(Filter filter) {
    return Chip(
      label: Text( filter == null ? "Clear All" : filter.name,
        style: TextStyle(
          color: Colors.white,
        ),
      ),
      backgroundColor: filter==null ? Colors.red : ExerciseDatabase.hexToColor(filter.group.color),
      deleteIcon: Icon(Icons.close, color: Colors.white, size: 12),
      onDeleted: () {
        setState(() {
          if(filter==null) {
            currentFilters.clear();
          } else {
            currentFilters.remove(filter);
          }
          _updateGroups();
          _filterExercises();
        });
      },
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
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

  Widget _buildRow(Exercise exercise, bool saved) {
    return InkWell(
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ExerciseVideoScreen(
                exercise: exercise,
                saved: savedIds.contains(exercise.id.toString())),
          ),
        );
        setState(() {
          _loadFromDatabase(); // reload to get updated saved exercises
        });
      },
      child: ListTile(
        title: Text(exercise.name),
        trailing: saved // add a swiftset logo next to the exercise if it's been saved
            ? Padding(
                padding: const EdgeInsets.all(12.0),
                child: Image.asset('assets/images/swiftset.png'),
              )
            : null,
      ),
    );
  }

  void _filterSearchResults(String query) {
    setState(() {
      searchedExercises = allExercises
          .where((i) => _matchesQuery(i.name.toLowerCase(),query)).toList();
    });
  }

  // allows search results to still show if the words are in different order
  bool _matchesQuery(String exerciseName, String query) {
    bool match = true;
    query.split(" ").forEach((word) {
      if(!exerciseName.contains(word)) match = false;
    });
    return match;
  }

  // called when a filter is going to be added by a user
  void addFilter() async {
    var chosenFilter = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GroupSelectionScreen(filterGroups: currentGroups),
      ),
    );
    setState(() {
      if (chosenFilter.runtimeType == Filter) { // return a single filter
        Filter filter = chosenFilter as Filter;
        this.currentGroups.removeWhere((g) => g.id == filter.group.id);
        // ex: add angle after horizontal press is chosen
        this.currentGroups.addAll(filter.groupsToAdd);
        this.currentFilters.add(chosenFilter);
        _filterExercises();
      } else if (chosenFilter != null) { // returns list of multi filters
        List<Filter> multiFilters = chosenFilter as List<Filter>;
        if (multiFilters.isNotEmpty) {
          // all filters should have the same group
          currentGroups.removeWhere((g) => g.id == multiFilters[0].group.id);
          multiFilters.forEach((f) => this.currentFilters.add(f));
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

  // start out with no exercises and add all exercises that match multi filter
  void _filterMulti() {
    List<Filter> equipFilters = currentFilters.where((f) => f.group.name == "Equipment").toList();
    List<Filter> diffFilters = currentFilters.where((f) => f.group.name == "Difficulty").toList();
    Set<int> exerciseIds = new Set();

    if(equipFilters.isEmpty && diffFilters.isEmpty) {
      return;
    } else if(equipFilters.isEmpty) {
      exerciseIds = _getMatching(diffFilters);
    } else if(diffFilters.isEmpty) {
      exerciseIds = _getMatching(equipFilters);
    } else {
      exerciseIds = _getMatching(equipFilters).intersection(_getMatching(diffFilters));
    }

    filteredExercises = filteredExercises.where((exercise) => exerciseIds.contains(exercise.id)).toList();
  }

  // remove all exercises that don't match single filters
  void _filterSingle() {
    List<Filter> singleFilters =
    currentFilters.where((f) => !f.group.isMultiChoice).toList();
    singleFilters.forEach((f) => {
      this.filteredExercises =
          this.filteredExercises.where((e) => _matchesFilter(e, f)).toList()
    });
  }

  // Determine if an exercise should be removed by a filter
  bool _matchesFilter(Exercise exercise, Filter filter) {
    // Value from the exercise to check against filter
    var exerciseValue = exercise.toMap()[filter.dbColumn.toLowerCase()];
    if (exerciseValue == null) {
      return false;
    }
    exerciseValue = exerciseValue.toLowerCase();
    var filterValue = filter.dbSortBy.toLowerCase();

    if (filterValue.contains('/')) {
      // When multiple values are acceptable (Ex: chest, triceps for Push)
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

  void _filterHidden() {
    String filterString = '';
    if(prefs.containsKey("4")) { // 4 is id of difficulty group
      filterString += prefs.getString("4");
    }
    if(prefs.containsKey("5")) { // 5 is id of exercise group
      if(filterString.isNotEmpty) filterString += ",";
      filterString += "," + prefs.getString("5");
    }
    Set filterIds = filterString.split(",").toSet();
    List<Filter> hiddenFilters =
        allFilters.where((f) => filterIds.contains(f.id.toString())).toList();
    hiddenFilters.forEach(
        (f) => this.filteredExercises.removeWhere((e) => _matchesFilter(e, f)));
    hiddenFilters.forEach(
        (f) => this.filteredExercises.removeWhere((e) => _matchesFilter(e, f)));
  }

  // finf all exercises that match a least one filter from a group of filters
  Set<int> _getMatching(List<Filter> filters) {
    Set<int> exerciseIds = new Set();
    for (int i = 0; i < filters.length; i++) {
      List<Exercise> matchingExercises = allExercises
          .where((e) => _matchesFilter(e, filters[i]))
          .toList();
      matchingExercises.forEach((e) => exerciseIds.add(e.id));
    }
    return exerciseIds;
  }

  void _openRandomExercise() async {
    final _random = new Random();
    var exercise = searchedExercises[_random.nextInt(searchedExercises.length)];
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ExerciseVideoScreen(
            exercise: exercise,
            saved: savedIds.contains(exercise.id.toString())),
      ),
    );
  }

  _changeSorting() {
    setState(() {
      sortedAlpha = !sortedAlpha;
      if (sortedAlpha) {
        this.searchedExercises.sort((a,b) => a.name.compareTo(b.name));
        Scaffold.of(context).showSnackBar(SnackBar(
          content: Text("Sorting Alphabetically"),
          duration: Duration(milliseconds: 800),
        ));
      } else {
        this.searchedExercises.sort((a,b) => b.id.compareTo(a.id));
        Scaffold.of(context).showSnackBar(SnackBar(
          content: Text("Sorting By Newest"),
          duration: Duration(milliseconds: 800),
        ));
      }
    });
  }
}
