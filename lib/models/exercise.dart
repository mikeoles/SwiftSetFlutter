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

  Exercise({required this.id, required this.name, required this.url, required this.difficulty, required this.primary, 
  required this.equipment, required this.movement, required this.angle, required this.tempo, required this.unilateral, 
  required this.joint, required this.stability, required this.sport, required this.grip});

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