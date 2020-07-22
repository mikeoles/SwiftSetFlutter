import 'dart:math';

import 'package:flutter/material.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/utils/exercise_database.dart';

class SingleFilterSelectionScreen extends StatefulWidget {
  final FilterGroup filterGroup;

  SingleFilterSelectionScreen({this.filterGroup});

  @override
  _SingleFilterSelectionScreenState createState() =>
      _SingleFilterSelectionScreenState();
}

class _SingleFilterSelectionScreenState
    extends State<SingleFilterSelectionScreen> {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: ExerciseDatabase.getAllFilters(),
        builder: (BuildContext context, AsyncSnapshot<List<Filter>> snapshot) {
          if (snapshot.hasData) {
            List<Filter> matchingFilters = snapshot.data
                .where((i) => i.group.id == widget.filterGroup.id)
                .toList();
            if (matchingFilters.length == 1)
              Navigator.pop(context, matchingFilters[0]);
            return Scaffold(
              body: SafeArea(
                child: Column(
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
                    Expanded(child: _filterList(matchingFilters))
                  ],
                ),
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
        final group = filters[index];
        return _buildRow(group, filters.length, context);
      },
    );
  }

  Widget _buildRow(Filter filter, int itemCount, BuildContext context) {
    return Container(
      height:
          max(((MediaQuery.of(context).size.height - 100) / itemCount), 100),
      child: Card(
        child: ListTile(
            title: Center(
              child: Text(
                filter.name,
                style: TextStyle(fontSize: 24),
              ),
            ),
            onTap: () => Navigator.pop(context, filter)),
      ),
    );
  }
}
