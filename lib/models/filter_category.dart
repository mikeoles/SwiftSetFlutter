class FilterCategory {
  final int id;
  final String name;

  FilterCategory(this.id, this.name);

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'Name': name,
    };
  }
}