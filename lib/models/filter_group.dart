class FilterGroup {
  final int id;
  final String name;
  final bool isMultiChoice;
  final bool isDefault;
  final String color;
  final String image;

  FilterGroup({required this.id, required this.name, required this.isMultiChoice, required  this.isDefault, required  this.color, required this.image});

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'isMultiChoice': isMultiChoice,
      'isDefault': isDefault,
      'color': color,
      'image': image,
    };
  }
}