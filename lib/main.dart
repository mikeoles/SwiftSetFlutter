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
  List<Widget> pages;
  ExerciseFinder exerciseFinder;
  SavedExercises savedExercises;
  Settings settings;
  Widget currentPage;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    exerciseFinder = new ExerciseFinder();
    savedExercises = new SavedExercises();
    settings = new Settings();
    pages = [exerciseFinder,savedExercises, settings];
    currentPage = exerciseFinder;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Swift Set',
      theme: ThemeData(),
      darkTheme: ThemeData.dark(),
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
      child: FloatingActionButton.extended(
        onPressed: () => exerciseFinder.addFilter(),
        tooltip: 'Increment Counter',
        icon: const Icon(Icons.filter_list),
        label: Text("Filter")
      ),
    );
  }

  Widget _navBar() {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.search),
          title: Text('Search'),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.favorite),
          title: Text('Saved'),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings),
          title: Text('Settings'),
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
