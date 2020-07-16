class Exercise {
  final int id;
  final String name;
  final String url;
  final String difficulty;
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
      'id': id,
      'name': name,
      'url': url,
      'difficulty': difficulty,
      'primary': primary,
      'equipment': equipment,
      'movement': movement,
      'angle': angle,
      'tempo': tempo,
      'unilateral': unilateral,
      'joint': joint,
      'stability': stability,
      'sport': sport,
      'grip': grip,
    };
  }
}