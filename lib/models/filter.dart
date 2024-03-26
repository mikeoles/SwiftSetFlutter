import 'filter_group.dart';

class Filter {
  final int id;
  final String name;
  final String dbColumn;
  final String dbSortBy;
  final FilterGroup group;
  final List<FilterGroup> groupsToAdd;

  Filter({required this.id, required this.name, required this.dbColumn, required this.dbSortBy, required this.group, required this.groupsToAdd});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'dbColumn': dbColumn,
      'dbSortBy': dbSortBy,
      'group': group,
      'groupdsToAdd': groupsToAdd,
    };
  }
}