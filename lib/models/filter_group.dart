class FilterGroup {
  final int id;
  final String name;
  final bool isMultiChoice;
  final bool isDefault;
  final String color;

  FilterGroup({this.id, this.name, this.isMultiChoice, this.isDefault, this.color});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'isMultiChoice': isMultiChoice,
      'isDefault': isDefault,
      'color': color,
    };
  }
}