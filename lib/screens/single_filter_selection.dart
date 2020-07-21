import 'package:flutter/material.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/utils/exercise_database.dart';

class SingleFilterSelectionScreen extends StatefulWidget {
  final int filterGroupId;

  SingleFilterSelectionScreen({this.filterGroupId});

  @override
  _SingleFilterSelectionScreenState createState() => _SingleFilterSelectionScreenState();
}

class _SingleFilterSelectionScreenState extends State<SingleFilterSelectionScreen> {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: ExerciseDatabase.getAllFilters(),
      builder: (BuildContext context, AsyncSnapshot<List<Filter>> snapshot) {
        if (snapshot.hasData) {
          List<Filter> matchingFilters = snapshot.data.where((i) => i.group.id == widget.filterGroupId).toList();
          return Scaffold(
            body: SafeArea(
                child: _filterList(matchingFilters)
            ),
          );
        } else {
          return Scaffold(
            body: SafeArea(
                child: Text("Loading")
            ),
          );
        }
      }
    );
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
    return InkWell(
      onTap: () {
        Navigator.pop(context, filter);
      },
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text(filter.name),
          ),
        ),
      ),
    );
  }
}

