class Filter {
  final int id;
  final String name;
  final String dbColumn;
  final String dbSortBy;
  final int groupId;

  Filter({this.id, this.name, this.dbColumn, this.dbSortBy, this.groupId});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'dbColumn': dbColumn,
      'dbSortBy': dbSortBy,
      'filter_group': groupId
    };
  }
}