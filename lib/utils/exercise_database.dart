import 'dart:async';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:swiftset/models/exercise.dart';
import 'package:swiftset/models/filter.dart';
import 'package:swiftset/models/filter_group.dart';

class ExerciseDatabase {
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
    ByteData data = await rootBundle.load("assets/main_exercises_19.db");
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
    ByteData data = await rootBundle.load("assets/main_exercises_19.db");
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
        );
      });
    }

    return getFilterGroups();
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
    ByteData data = await rootBundle.load("assets/main_exercises_19.db");
    List<int> bytes = data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
    await File(dbPath).writeAsBytes(bytes);

    var database = await openDatabase(dbPath);

    Future<List<Filter>> getFilters() async {
      // Get a reference to the database.
      final Database db = database;

      // Query the table for all The Exercises.
      final List<Map<String, dynamic>> maps = await db.query('filters');

      // Convert the List<Map<String, dynamic> into a List<Exercise>.
      return List.generate(maps.length, (i) {
        return Filter(
          id: maps[i]['id'],
          name: maps[i]['name'],
          dbColumn: maps[i]['dbColumn'],
          dbSortBy: maps[i]['dbSortBy'],
          groupId: maps[i]['filter_group'],
        );
      });
    }

    return getFilters();
  }
}
