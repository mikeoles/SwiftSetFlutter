import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/utils/exercise_database.dart';

class MultiFilterSelectionScreen extends StatefulWidget {
  final FilterGroup filterGroup;

  MultiFilterSelectionScreen({required this.filterGroup});

  @override
  _SingleFilterSelectionScreenState createState() =>
      _SingleFilterSelectionScreenState();
}

class _SingleFilterSelectionScreenState
    extends State<MultiFilterSelectionScreen> {
  Map<int, bool> values = {};
  Set<String> hiddenOptions = {};

  @override
  void initState() {
    super.initState();
    values = new Map();
    _getHiddenOptions();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: ExerciseDatabase.getAllFilters(),
        builder: (BuildContext context, AsyncSnapshot<List<Filter>> snapshot) {
          if (snapshot.hasData) {
            List<Filter> matchingFilters = snapshot.data
                ?.where((i) => i.group.id == widget.filterGroup.id)
                .toList() ?? [];
            matchingFilters
                .removeWhere((f) => hiddenOptions.contains(f.id.toString()));

            return Scaffold(
              body: SafeArea(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _title(),
                      _filterList(matchingFilters),
                      if (hiddenOptions.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            'Some filters are hidden based on your settings.',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                      _selectButton(),
                    ]),
              ),
            );
          } else {
            return Scaffold(
              body: SafeArea(child: Text("Loading")),
            );
          }
        });
  }

  Widget _filterList(List<Filter> filters) {
    return Expanded(
      child: filters.length > 10
          ? GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 4.0,
          crossAxisSpacing: 4.0,
          childAspectRatio: 3,
        ),
        itemCount: filters.length,
        itemBuilder: (context, index) {
          return _buildRow(filters[index], context);
        },
      )
          : ListView.builder(
        itemCount: filters.length,
        itemBuilder: (context, index) {
          return _buildRow(filters[index], context);
        },
      ),
    );
  }

  Widget _buildRow(Filter filter, BuildContext context) {
    return GestureDetector(
        onTap: () {
          setState(() {
            values[filter.id] = !(values[filter.id] ?? false);
          });
        },
        child:Padding(
          padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 2.0),
          child: Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            elevation: 3,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0.0),
              child: Row(
                children: [
                  Checkbox(
                    value: values.containsKey(filter.id) && values[filter.id]!,
                    onChanged: (bool? value) {
                      setState(() {
                        values[filter.id] = value ?? false;
                      });
                    },
                    activeColor: Colors.blue,
                    checkColor: Colors.white,
                  ),
                  Expanded(
                    child: Text(
                      filter.name,
                      style: TextStyle(
                        fontSize: 16, // Slightly smaller font to fit grid
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
    );
  }



  Widget _selectButton() {
    return Align(
      alignment: Alignment.bottomCenter,
      child: ElevatedButton(
        onPressed: () {
          _selectPressed();
        },
        child: const Text(
          'Select',
          style: TextStyle(
            fontSize: 20,
            color: Colors.white, // Set text color to white
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          elevation: 5,
        ),
      ),
    );
  }

  _selectPressed() async {
    List<Filter> filters = await ExerciseDatabase.getAllFilters();
    filters =
        filters.where((f) => f.group.id == widget.filterGroup.id).toList();
    filters =
        filters.where((f) => values.containsKey(f.id) && (values[f.id] ?? false)).toList();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      Navigator.pop(context, filters);
    });
  }

  void _getHiddenOptions() async {
    final prefs = await SharedPreferences.getInstance();
    final savedExercisesString =
        prefs.getString(widget.filterGroup.id.toString()) ?? '';
    hiddenOptions = savedExercisesString.split(',').toSet();
  }

  Widget _title() {
    return Padding(
      padding: EdgeInsets.all(13),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            'assets/images/' +
                widget.filterGroup.image.toString(),
            color: ExerciseDatabase.hexToColor(
                widget.filterGroup.color),
          ),
          Text(
            widget.filterGroup.name,
            style: TextStyle(
              fontSize: 24,
              color: ExerciseDatabase.hexToColor(
                  widget.filterGroup.color),
            ),
          ),
        ],
      ),
    );
  }
}
