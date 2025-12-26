import 'package:flutter/material.dart';
import 'widgets/app_glass_card.dart';
import 'agent_actions_screen.dart';

/// Screen 2: Daily Check-In
class DailyCheckinScreen extends StatefulWidget {
  const DailyCheckinScreen({super.key});

  @override
  State<DailyCheckinScreen> createState() => _DailyCheckinScreenState();
}

class _DailyCheckinScreenState extends State<DailyCheckinScreen> {
  double _sleepHours = 7.0;
  String _mealsSkipped = 'None';
  String _mood = 'medium';
  final TextEditingController _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(10),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.arrow_back,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Daily Check-In',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Form
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sleep Hours
                      _buildSectionCard(
                        title: 'Sleep hours',
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.blue.withAlpha(40),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'Stow',
                                style: TextStyle(
                                  color: Colors.blue,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.keyboard_arrow_up,
                              color: Colors.white.withAlpha(150),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            const SizedBox(height: 12),
                            SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                activeTrackColor: Colors.cyan,
                                inactiveTrackColor: Colors.white.withAlpha(30),
                                thumbColor: Colors.cyan,
                                overlayColor: Colors.cyan.withAlpha(30),
                                trackHeight: 6,
                              ),
                              child: Slider(
                                value: _sleepHours,
                                min: 0,
                                max: 12,
                                divisions: 24,
                                onChanged: (v) =>
                                    setState(() => _sleepHours = v),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${_sleepHours.toStringAsFixed(0)} hours',
                                    style: TextStyle(
                                      color: Colors.white.withAlpha(150),
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    '56/wk',
                                    style: TextStyle(
                                      color: Colors.white.withAlpha(100),
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Meals Skipped
                      _buildSectionCard(
                        title: 'Meals skipped',
                        child: Padding(
                          padding: const EdgeInsets.only(top: 12),
                          child: Row(
                            children: [
                              _buildDropdown(
                                value: _mealsSkipped,
                                options: [
                                  'None',
                                  'Breakfast',
                                  'Lunch',
                                  'Dinner',
                                ],
                                onChanged: (v) =>
                                    setState(() => _mealsSkipped = v!),
                              ),
                              const SizedBox(width: 12),
                              _buildMiniButton(Icons.person, '1 Lonne'),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Mood
                      _buildSectionCard(
                        title: 'Mood',
                        child: Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildMoodButton('low', '😔', 'Low'),
                              _buildMoodButton('medium', '😐', 'Medium'),
                              _buildMoodButton('high', '😊', 'High'),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Notes
                      _buildSectionCard(
                        title: 'Notes',
                        child: Padding(
                          padding: const EdgeInsets.only(top: 12),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: Colors.green.withAlpha(40),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.check,
                                  color: Colors.green,
                                  size: 14,
                                ),
                              ),
                              const SizedBox(width: 10),
                              Text(
                                'Lucy level',
                                style: TextStyle(
                                  color: Colors.white.withAlpha(150),
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),

              // Run Button
              Padding(
                padding: const EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _runWellsync,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text(
                      'Run Wellsync',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _runWellsync() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AgentActionsScreen(
          sleepHours: _sleepHours,
          mealsSkipped: _mealsSkipped,
          mood: _mood,
          notes: _notesController.text,
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    Widget? trailing,
    required Widget child,
  }) {
    return AppGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (trailing != null) trailing,
              ],
            ),
            child,
          ],
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> options,
    required ValueChanged<String?> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withAlpha(20)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          items: options
              .map(
                (o) => DropdownMenuItem(
                  value: o,
                  child: Text(
                    o,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                  ),
                ),
              )
              .toList(),
          onChanged: onChanged,
          dropdownColor: const Color(0xFF1E1B4B),
          icon: Icon(
            Icons.keyboard_arrow_down,
            color: Colors.white.withAlpha(150),
            size: 18,
          ),
          isDense: true,
        ),
      ),
    );
  }

  Widget _buildMiniButton(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withAlpha(20)),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white.withAlpha(150), size: 16),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildMoodButton(String value, String emoji, String label) {
    final isSelected = _mood == value;
    return GestureDetector(
      onTap: () => setState(() => _mood = value),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isSelected
                  ? Colors.amber.withAlpha(40)
                  : Colors.white.withAlpha(10),
              shape: BoxShape.circle,
              border: Border.all(
                color: isSelected ? Colors.amber : Colors.white.withAlpha(20),
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Text(emoji, style: const TextStyle(fontSize: 24)),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.white.withAlpha(100),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
