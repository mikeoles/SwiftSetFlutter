import 'package:flutter/material.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/multi_filter_selection.dart';
import 'package:swiftset/screens/single_filter_selection.dart';
import 'package:swiftset/utils/exercise_database.dart';

class GroupSelectionScreen extends StatelessWidget {
  final List<FilterGroup> filterGroups;

  GroupSelectionScreen({Key key, @required this.filterGroups})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'Filter Exercises',
                style: TextStyle(fontSize: 24),
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(child: _groupList())
          ],
        ),
      ),
    );
  }

  Widget _groupList() {
    return GridView.builder(
      gridDelegate:
          SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
      itemCount: filterGroups.length,
      itemBuilder: (context, index) {
        final group = filterGroups[index];
        return _buildRow(group, context);
      },
    );
  }

  Widget _buildRow(FilterGroup filterGroup, BuildContext context) {
    var brightness = MediaQuery.of(context).platformBrightness;
    bool darkModeOn = brightness == Brightness.dark;

    return InkWell(
      onTap: () async {
        var result;
        if (filterGroup.isMultiChoice) {
          result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  MultiFilterSelectionScreen(filterGroup: filterGroup),
            ),
          );
        } else {
          result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  SingleFilterSelectionScreen(filterGroup: filterGroup),
            ),
          );
        }
        if (result != null) {
          Navigator.pop(context, result);
        }
      },
      child: Card(
        color: darkModeOn ? Colors.black: Colors.white,
        child: Column(
          children: [
            Image.asset(
              'assets/images/' + filterGroup.image.toString(),
              color: ExerciseDatabase.hexToColor(filterGroup.color),
              height: 100,
              width: 100,
            ),
            Center(
              child: Text(
                filterGroup.name,
                style: TextStyle(fontSize: 24, color: darkModeOn ? Colors.white: Colors.black),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
