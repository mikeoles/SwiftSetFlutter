import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/models/filter_group.dart';

class ExerciseDatabase {
  // groups that are added when a filter is chosen (ex: chest movemment patterns added after chest)
  static final map = {
    57: [1], // Horizontal Pull -> Angle
    58: [7], // Vertical Pull -> Grip
    60: [7], // Pullup Variations -> Grip
    61: [2,1,7], // Chest -> Angle, Chest Movements, Grip
    62: [16], // Shoulders -> Shoulder Movements
    63: [7,11], // lats -> Grip, Lat Movements
    65: [7], // Rear Delts -> Grip
    66: [7,20], // Triceps -> Grip, Triceps Movements
    67: [7], // Biceps ->  Grip
    68: [6], // Forearms -> Forearm Movements
    69: [13], // Neck -> Neck Movements
    70: [3], // Core -> Core Movements
    72: [22], // Quads -> Quad Movements
    73: [8], // Hamstrings -> Hamstring Movements
    76: [9], // Hips -> Hip Movements
    85: [7], // Overhead Press -> Grip
    86: [1], // Front Raise -> Grip
  };

  static List<int> newGroupsByFilterId(int filterId) {
    if(map.containsKey(filterId)) return map[filterId];
    return List();
  }

  static Future<List<Exercise>> getAllExercises() async {
    // Avoid errors caused by flutter upgrade.
    // Importing 'package:flutter/widgets.dart' is required.
    WidgetsFlutterBinding.ensureInitialized();

    // Construct the path to the app's writable database file:
    var dbDir = await getDatabasesPath();
    var dbPath = join(dbDir, "app.db");

    // Delete any existing database:
    await deleteDatabase(dbPath);

    // Create the writable database file from the bundled demo database file:
    ByteData data = await rootBundle.load("assets/exercises.db");
    List<int> bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
    await File(dbPath).writeAsBytes(bytes);

    var database = await openDatabase(dbPath);

    Future<List<Exercise>> getExercises() async {
      // Get a reference to the database.
      final Database db = database;

      // Query the table for all The Exercises.
      final List<Map<String, dynamic>> maps = await db.query('exercises');

      // Convert the List<Map<String, dynamic> into a List<Exercise>.
      return List.generate(maps.length, (i) {
        return Exercise(
          id: maps[i]['id'],
          name: maps[i]['name'],
          url: maps[i]['url'],
          difficulty: maps[i]['difficulty'],
          primary: maps[i]['primary'],
          equipment: maps[i]['equipment'],
          angle: maps[i]['angle'],
          tempo: maps[i]['tempo'],
          unilateral: maps[i]['unilateral'],
          joint: maps[i]['joint'],
          stability: maps[i]['stability'],
          sport: maps[i]['sport'],
          grip: maps[i]['grip'],
          movement: maps[i]['movement']
        );
      });
    }

    return getExercises();
  }

  static Future<List<FilterGroup>> getAllFilterGroups() async {
    // Avoid errors caused by flutter upgrade.
    // Importing 'package:flutter/widgets.dart' is required.
    WidgetsFlutterBinding.ensureInitialized();

    // Construct the path to the app's writable database file:
    var dbDir = await getDatabasesPath();
    var dbPath = join(dbDir, "app.db");

    // Delete any existing database:
    await deleteDatabase(dbPath);

    // Create the writable database file from the bundled demo database file:
    ByteData data = await rootBundle.load("assets/exercises.db");
    List<int> bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
    await File(dbPath).writeAsBytes(bytes);

    var database = await openDatabase(dbPath);

    Future<List<FilterGroup>> getFilterGroups() async {
      // Get a reference to the database.
      final Database db = database;

      // Query the table for all The Exercises.
      final List<Map<String, dynamic>> maps = await db.query('filter_groups');

      // Convert the List<Map<String, dynamic> into a List<Exercise>.
      return List.generate(maps.length, (i) {
        return FilterGroup(
          id: maps[i]['id'],
          name: maps[i]['name'],
          isMultiChoice: maps[i]['isMultiChoice'] == 1,
          isDefault: maps[i]['isDefault'] == 1,
          color: maps[i]['color'],
          image: maps[i]['image'],
        );
      });
    }

    return getFilterGroups();
  }

  static Future<List<FilterGroup>> getStartingFilterGroups() async {
    var allGroups = await getAllFilterGroups();
    return allGroups.where((g) => g.isDefault).toList();
  }

  static Future<FilterGroup> getGroupsById(int id) async {
    var allGroups = await getAllFilterGroups();
    return allGroups.firstWhere((g) => g.id == id);
  }

  static Future<List<Filter>> getAllFilters() async {
    // Avoid errors caused by flutter upgrade.
    // Importing 'package:flutter/widgets.dart' is required.
    WidgetsFlutterBinding.ensureInitialized();

    // Construct the path to the app's writable database file:
    var dbDir = await getDatabasesPath();
    var dbPath = join(dbDir, "app.db");

    // Delete any existing database:
    await deleteDatabase(dbPath);

    // Create the writable database file from the bundled demo database file:
    ByteData data = await rootBundle.load("assets/exercises.db");
    List<int> bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
    await File(dbPath).writeAsBytes(bytes);

    var database = await openDatabase(dbPath);

    Future<List<Filter>> getFilters() async {
      // Get a reference to the database.
      final Database db = database;

      // Query the table for all The Exercises.
      final List<Map<String, dynamic>> maps = await db.query('filters');

      List<FilterGroup> allGroups = await getAllFilterGroups();
      // Convert the List<Map<String, dynamic> into a List<Exercise>.
      return List.generate(maps.length, (i) {
        return Filter(
          id: maps[i]['id'],
          name: maps[i]['name'],
          dbColumn: maps[i]['dbColumn'],
          dbSortBy: maps[i]['dbSortBy'],
          group: allGroups.firstWhere((g) => g.id == maps[i]['filter_group']),
          groupsToAdd: allGroups.where((g) => newGroupsByFilterId(maps[i]['id']).contains(g.id)).toList(),
        );
      });
    }

    return getFilters();
  }

  static Color hexToColor(String code) {
    if (code == null) return Colors.red;
    return new Color(int.parse(code.substring(1, 7), radix: 16) + 0xFF000000);
  }
}
