import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/utils/exercise_database.dart';

class MultiFilterSelectionScreen extends StatefulWidget {
  final int filterGroupId;

  MultiFilterSelectionScreen({this.filterGroupId});

  @override
  _SingleFilterSelectionScreenState createState() =>
      _SingleFilterSelectionScreenState();
}

class _SingleFilterSelectionScreenState
    extends State<MultiFilterSelectionScreen> {
  Map<int, bool> values;

  @override
  void initState() {
    super.initState();
    values = new Map();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: ExerciseDatabase.getAllFilters(),
        builder: (BuildContext context, AsyncSnapshot<List<Filter>> snapshot) {
          if (snapshot.hasData) {
            List<Filter> matchingFilters = snapshot.data
                .where((i) => i.group.id == widget.filterGroupId)
                .toList();
            return Scaffold(
              body: SafeArea(
                child: Column(children: [
                  Expanded(
                    child: _filterList(matchingFilters),
                  ),
                  _selectButton(),
                ]),
              ),
            );
          } else {
            return Scaffold(
              body: SafeArea(
                  child: Text("Loading")
              ),
            );
          }
        });
  }

  Widget _filterList(List<Filter> filters) {
    return ListView.builder(
      itemCount: filters.length,
      itemBuilder: (context, index) {
        final group = filters[index];
        return _buildRow(group, context);
      },
    );
  }

  Widget _buildRow(Filter filter, BuildContext context) {
    return new CheckboxListTile(
      title: new Text(filter.name),
      value: values.containsKey(filter.id) && values[filter.id],
      onChanged: (bool value) {
        setState(() {
          values[filter.id] = value;
        });
      },
    );
  }

  Widget _selectButton() {
    return Align(
      alignment: Alignment.bottomCenter,
      child: RaisedButton(
        onPressed: () {
          _selectPressed();
        },
        child: const Text('Select', style: TextStyle(fontSize: 20)),
        color: Colors.blue,
        textColor: Colors.white,
        elevation: 5,
      ),
    );
  }

  _selectPressed() async {
    List<Filter> test = await ExerciseDatabase.getAllFilters();
    test = test.where((i) => i.group.id == widget.filterGroupId).toList();
    test = test.where((f) => values.containsKey(f.id) && values[f.id]).toList();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      Navigator.pop(context, test);
    });
  }
}
