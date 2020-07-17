import 'filter_group.dart';

class Filter {
  final int id;
  final String name;
  final String dbColumn;
  final String dbSortBy;
  final FilterGroup group;

  Filter({this.id, this.name, this.dbColumn, this.dbSortBy, this.group});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'dbColumn': dbColumn,
      'dbSortBy': dbSortBy,
      'group': group
    };
  }
}