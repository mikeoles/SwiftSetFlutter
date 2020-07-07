class Exercise {
  final int id;
  final String name;
  final String url;

  Exercise({this.id, this.name, this.url});

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'Name': name,
      'Url': url,
    };
  }
}