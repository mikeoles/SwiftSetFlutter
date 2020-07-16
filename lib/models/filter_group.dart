class FilterGroup {
  final int id;
  final String name;
  final bool isMultiChoice;

  FilterGroup({this.id, this.name, this.isMultiChoice});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'isMultiChoice': isMultiChoice,
    };
  }
}