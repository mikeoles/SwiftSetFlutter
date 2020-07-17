class FilterGroup {
  final int id;
  final String name;
  final bool isMultiChoice;
  final bool isDefault;

  FilterGroup({this.id, this.name, this.isMultiChoice, this.isDefault});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'isMultiChoice': isMultiChoice,
      'isDefault': isDefault
    };
  }
}