import 'dart:async';

import 'package:flutter/material.dart';
import 'package:swiftset/screens/exercise_search.dart';
import 'package:swiftset/screens/saved_exercises.dart';
import 'package:swiftset/screens/settings.dart';

void main() => runApp(Home());

class Home extends StatefulWidget {

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<Widget> pages = [];
  ExerciseFinder exerciseFinder = new ExerciseFinder();
  SavedExercises savedExercises = new SavedExercises();
  Settings settings = new Settings();
  Widget currentPage = Text("No widget to build");
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    exerciseFinder = new ExerciseFinder();
    savedExercises = new SavedExercises();
    pages = [exerciseFinder,savedExercises, settings];
    currentPage = exerciseFinder;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Swift Set',
      theme: ThemeData(),
      darkTheme: ThemeData.dark(),
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: currentPage,
        floatingActionButton: _button(),
        bottomNavigationBar: _navBar(),
      ),
    );
  }

  Widget _button() {
    return Visibility(
      visible: _selectedIndex == 0,
      child: Tooltip(
        message: 'Increment Counter',
        textStyle: TextStyle(color: Colors.white), // Set text color to white
        decoration: BoxDecoration(
          color: Colors.black, // Set the background color of the tooltip
          borderRadius: BorderRadius.circular(4),
        ),
        child: FloatingActionButton.extended(
          onPressed: () => exerciseFinder.addFilter(),
          icon: const Icon(Icons.filter_list, color: Colors.white), // Set icon color to white
          label: Text(
            "Filter",
            style: TextStyle(color: Colors.white), // Set text color to white
          ),
          backgroundColor: Colors.blue, // Set the background color here
        ),
      ),
    );
  }

  Widget _navBar() {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.search),
          label: 'Search',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.favorite),
          label: 'Saved',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings),
          label: 'Settings',
        ),
      ],
      currentIndex: _selectedIndex,
      selectedItemColor: Colors.blueAccent,
      onTap: _onItemTapped,
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
      currentPage = pages[index];
    });
  }
}
