import 'package:flutter/material.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/single_filter_selection.dart';

class GroupSelectionScreen extends StatelessWidget {
  final List<FilterGroup> filterGroups;

  GroupSelectionScreen({Key key, @required this.filterGroups}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: SafeArea(
        child: _groupList()
      ),
    );
  }

  Widget _groupList() {
    return Expanded(
      child: ListView.builder(
        itemCount: filterGroups.length,
        itemBuilder: (context, index) {
          final group = filterGroups[index];
          return _buildRow(group, context);
        },
      ),
    );
  }

  Widget _buildRow(FilterGroup filterGroup, BuildContext context) {
    return InkWell(
      onTap: () async {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SingleFilterSelectionScreen(filterGroupId: filterGroup.id),
          ),
        );

        Navigator.pop(context, result);
      },
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text(filterGroup.name),
          ),
        ),
      ),
    );
  }
}
