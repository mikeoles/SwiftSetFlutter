import 'package:flutter/material.dart';
import 'package:launch_review/launch_review.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swiftset/models/filter_group.dart';
import 'package:swiftset/screens/settings_selection.dart';
import 'package:swiftset/utils/exercise_database.dart';
import 'package:url_launcher/url_launcher.dart';

class Settings extends StatelessWidget {

  @override
  void initState() {
  }

  Brightness _getBrightness() {
    return Brightness.light;
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      isMaterialAppTheme: true,
      data: ThemeData(
        brightness: _getBrightness(),
      ),
      child: Scaffold(
        body: SafeArea(
          child: Stack(
          fit: StackFit.expand,
          children: <Widget>[
            SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Card(
                    elevation: 4.0,
                    margin: const EdgeInsets.fromLTRB(32.0, 8.0, 32.0, 16.0),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0)),
                    child: Column(
                      children: <Widget>[
                        ListTile(
                          leading: Icon(
                            Icons.assignment_turned_in,
                            color: Colors.blue,
                          ),
                          title: Text("Hide Difficulty Levels"),
                          trailing: Icon(Icons.keyboard_arrow_right),
                          onTap: () async {
                            FilterGroup group = await ExerciseDatabase.getGroupsById(4);
                            var hiddenEquipment = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    SettingsSelectionScreen(filterGroup: group,),
                              ),
                            );
                            _saveHidden(hiddenEquipment as Map<int, bool>, group.id);},
                        ),
                        _buildDivider(),
                        ListTile(
                          leading: Icon(
                            Icons.indeterminate_check_box,
                            color: Colors.blue,
                          ),
                          title: Text("Hide Equipment"),
                          trailing: Icon(Icons.keyboard_arrow_right),
                          onTap: () async {
                            FilterGroup group = await ExerciseDatabase.getGroupsById(5);
                            var hiddenEquipment = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    SettingsSelectionScreen(filterGroup: group),
                              ),
                            );
                            _saveHidden(hiddenEquipment as Map<int, bool>, group.id);
                          },
                        ),
                        _buildDivider(),
                        ListTile(
                          leading: Icon(
                            Icons.star,
                            color: Colors.blue,
                          ),
                          title: Text("Rate SwiftSet"),
                          trailing: Icon(Icons.keyboard_arrow_right),
                          onTap: () {
                            LaunchReview.launch(androidAppId: 'com.michaeloles.swiftset',
                                iOSAppId: '401626263');
                          },
                        ),
                        _buildDivider(),
                        ListTile(
                          leading: Icon(
                            Icons.lock,
                            color: Colors.blue,
                          ),
                          title: Text("Privacy Policy"),
                          trailing: Icon(Icons.keyboard_arrow_right),
                          onTap: () => _launchURL('https://github.com/mikeoles/SwiftSetFlutter/wiki/Privacy-Policy'),
                        ),
                        _buildDivider(),
                        ListTile(
                          leading: Icon(
                            Icons.mail,
                            color: Colors.blue,
                          ),
                          title: Text("Contact Us"),
                          trailing: Icon(Icons.keyboard_arrow_right),
                          onTap: () => _launchURL('https://github.com/mikeoles/SwiftSetFlutter/wiki/Contact-Us'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20.0),
                  Text(
                    "Notification Settings",
                    style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                  SwitchListTile(
                    activeColor: Colors.blue,
                    contentPadding: const EdgeInsets.all(0),
                    value: true,
                    title: Text("Allow Notifications"),
                    onChanged: (val) {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }

  Container _buildDivider() {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: 8.0,
      ),
      width: double.infinity,
      height: 1.0,
      color: Colors.grey.shade400,
    );
  }

  void _saveHidden(Map<int, bool> hiddenEquipment, int id) async {
    if (hiddenEquipment != null) {
      final prefs = await SharedPreferences.getInstance();
      hiddenEquipment.removeWhere((key, value) => value == false);
      var keys = hiddenEquipment.keys.toList();
      prefs.setString(id.toString(), keys.join(','));
    }
  }

  _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}