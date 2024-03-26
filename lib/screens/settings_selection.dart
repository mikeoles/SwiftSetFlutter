import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/utils/exercise_database.dart';

class SettingsSelectionScreen extends StatefulWidget {
  final FilterGroup filterGroup;

  SettingsSelectionScreen({required this.filterGroup});

  @override
  _SettingsSelectionScreenState createState() =>
      _SettingsSelectionScreenState();
}

class _SettingsSelectionScreenState
    extends State<SettingsSelectionScreen> {
  Map<int, bool> values = {};

  @override
  void initState() {
    super.initState();
    values = new Map<int, bool>();
    _getCurretlySavedOptions();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: ExerciseDatabase.getAllFilters(),
        builder: (BuildContext context, AsyncSnapshot<List<Filter>> snapshot) {
          if (snapshot.hasData) {
            List<Filter>? matchingFilters = snapshot.data
              ?.where((f) => values.containsKey(f.id) && (values[f.id] ?? false))
              .toList();
//            if (!widget.settings) {
//              matchingFilters.removeWhere((f) => savedValues.containsKey(f.id.toString()) && savedValues[f.id.toString()]);
//            }
            return Scaffold(
              body: SafeArea(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
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
                      ),
                      Expanded(
                        child: _filterList(matchingFilters ?? []),
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
    return ListView.builder(
      itemCount: filters.length,
      itemBuilder: (context, index) {
        return _buildRow(filters[index], context);
      },
    );
  }

  Widget _buildRow(Filter filter, BuildContext context) {
    return Container(
      height: 50,
      child: CheckboxListTile(
        title: new Text(
          filter.name,
        ),
        value: values.containsKey(filter.id) && (values[filter.id] ?? false),
        onChanged: (bool? value) {
          setState(() {
            values[filter.id] = value ?? false;
          });
        },
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
        child: Text('Save', style: TextStyle(fontSize: 20)),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          elevation: 5,
        ),
      ),
    );
  }

  _selectPressed() async {
      SchedulerBinding.instance.addPostFrameCallback((_) {
        Navigator.pop(context, values);
      });
  }

  void _getCurretlySavedOptions() async {
    final prefs = await SharedPreferences.getInstance();
    final savedExercisesString = prefs.getString(widget.filterGroup.id.toString()) ?? '';
    var savedValues = new Map<int, bool>();
    savedExercisesString.split(',').forEach((id) {
      if (id.isNotEmpty) savedValues[int.parse(id)] = true;
    });
    setState(() {
      values = savedValues;
    });
  }
}
