class Exercise {
  final int id;
  final String name;
  final String url;
  final int difficulty;
  final String primary;
  final String equipment;
  final String movement;
  final String angle;
  final String tempo;
  final String unilateral;
  final String joint;
  final String stability;
  final String sport;
  final String grip;

  Exercise({this.id, this.name, this.url, this.difficulty, this.primary, this.equipment,
  this.movement, this.angle, this.tempo, this.unilateral, this.joint, this.stability, this.sport, this.grip});

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'Name': name,
      'Url': url,
      'Difficulty': difficulty,
      'Primary': primary,
      'Equipment': equipment,
      'Movement': movement,
      'Angle': angle,
      'Tempo': tempo,
      'Unilateral': unilateral,
      'Joint': joint,
      'Stability': stability,
      'Sport': sport,
      'Grip': grip,
    };
  }
}