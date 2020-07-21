import 'package:flutter/material.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/multi_filter_selection.dart';
import 'package:swiftset/screens/single_filter_selection.dart';

class GroupSelectionScreen extends StatelessWidget {
  final List<FilterGroup> filterGroups;

  GroupSelectionScreen({Key key, @required this.filterGroups})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _groupList()),
    );
  }

  Widget _groupList() {
    return GridView.builder(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),
      itemCount: filterGroups.length,
      itemBuilder: (context, index) {
        final group = filterGroups[index];
        return _buildRow(group, context);
      },
    );
  }

  Widget _buildRow(FilterGroup filterGroup, BuildContext context) {
    return InkWell(
      onTap: () async {
        var result;
        if (filterGroup.isMultiChoice) {
          result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  MultiFilterSelectionScreen(filterGroupId: filterGroup.id),
            ),
          );
        } else {
          result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  SingleFilterSelectionScreen(filterGroupId: filterGroup.id),
            ),
          );
        }
        if (result != null) {
          Navigator.pop(context, result);
        }
      },
      child: Card(
        color: hexToColor(filterGroup.color),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text(filterGroup.name),
          ),
        ),
      ),
    );
  }

  Color hexToColor(String code) {
    if (code == null) return Colors.red;
    return new Color(int.parse(code.substring(1, 7), radix: 16) + 0xFF000000);
  }
}
