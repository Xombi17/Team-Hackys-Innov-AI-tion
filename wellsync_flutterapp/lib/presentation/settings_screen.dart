import 'package:flutter/material.dart';
import '../main.dart';
import 'widgets/app_glass_card.dart';

class SettingsScreen extends StatefulWidget {
  final Map<String, dynamic> currentProfile;
  final VoidCallback onSave;

  const SettingsScreen({
    super.key,
    required this.currentProfile,
    required this.onSave,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late String _dietType;
  late double _budget;
  late String _activityLevel;
  TimeOfDay _wakeTime = const TimeOfDay(hour: 6, minute: 30);
  TimeOfDay _sleepTime = const TimeOfDay(hour: 22, minute: 30);
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _dietType = widget.currentProfile['diet_type'] ?? 'veg';
    _budget = (widget.currentProfile['daily_budget'] ?? 500).toDouble();
    _activityLevel = widget.currentProfile['activity_level'] ?? 'moderate';

    // Parse times if available
    if (widget.currentProfile['wake_time'] != null) {
      _wakeTime = _parseTime(widget.currentProfile['wake_time']);
    }
    if (widget.currentProfile['sleep_time'] != null) {
      _sleepTime = _parseTime(widget.currentProfile['sleep_time']);
    }
  }

  TimeOfDay _parseTime(String timeStr) {
    try {
      final parts = timeStr.split(':');
      return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
    } catch (e) {
      return const TimeOfDay(hour: 7, minute: 0);
    }
  }

  Future<void> _saveSettings() async {
    setState(() => _isLoading = true);
    try {
      final user = supabase.auth.currentUser;
      if (user != null) {
        await supabase
            .from('user_profiles')
            .update({
              'diet_type': _dietType,
              'daily_budget': _budget.round(),
              'activity_level': _activityLevel,
              'wake_time':
                  '${_wakeTime.hour.toString().padLeft(2, '0')}:${_wakeTime.minute.toString().padLeft(2, '0')}',
              'sleep_time':
                  '${_sleepTime.hour.toString().padLeft(2, '0')}:${_sleepTime.minute.toString().padLeft(2, '0')}',
              'profile_data': {
                ...((widget.currentProfile['profile_data'] as Map?) ?? {}),
                'diet_type': _dietType,
                'daily_budget': _budget.round(),
                'activity_level': _activityLevel,
                'wake_time':
                    '${_wakeTime.hour.toString().padLeft(2, '0')}:${_wakeTime.minute.toString().padLeft(2, '0')}',
                'sleep_time':
                    '${_sleepTime.hour.toString().padLeft(2, '0')}:${_sleepTime.minute.toString().padLeft(2, '0')}',
              },
            })
            .eq('user_id', user.id);

        widget.onSave();
        if (mounted) Navigator.pop(context);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Preferences updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error saving preferences: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _selectTime(bool isWakeTime) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: isWakeTime ? _wakeTime : _sleepTime,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: Theme.of(context).primaryColor,
              onPrimary: Colors.white,
              surface: const Color(0xFF1E1B4B),
              onSurface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        if (isWakeTime) {
          _wakeTime = picked;
        } else {
          _sleepTime = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Preferences'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Container(
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                AppGlassCard(
                  child: Column(
                    children: [
                      // Diet Type
                      _buildSectionTitle('Diet Type'),
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ['Veg', 'Non-Veg', 'Vegan', 'Keto'].map((
                            diet,
                          ) {
                            final isSelected =
                                _dietType.toLowerCase() == diet.toLowerCase();
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(diet),
                                selected: isSelected,
                                onSelected: (selected) {
                                  if (selected)
                                    setState(
                                      () => _dietType = diet.toLowerCase(),
                                    );
                                },
                                selectedColor: Theme.of(context).primaryColor,
                                backgroundColor: Colors.white.withAlpha(20),
                                labelStyle: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : Colors.white70,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Activity Level
                      _buildSectionTitle('Activity Level'),
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children:
                              [
                                'Sedentary',
                                'Light',
                                'Moderate',
                                'Active',
                                'Very Active',
                              ].map((level) {
                                final isSelected =
                                    _activityLevel.toLowerCase() ==
                                    level.toLowerCase();
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: ChoiceChip(
                                    label: Text(level),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      if (selected)
                                        setState(
                                          () => _activityLevel = level
                                              .toLowerCase(),
                                        );
                                    },
                                    selectedColor: Theme.of(
                                      context,
                                    ).primaryColor,
                                    backgroundColor: Colors.white.withAlpha(20),
                                    labelStyle: TextStyle(
                                      color: isSelected
                                          ? Colors.white
                                          : Colors.white70,
                                    ),
                                  ),
                                );
                              }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Daily Budget
                      _buildSectionTitle('Daily Food Budget'),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            '₹100',
                            style: TextStyle(color: Colors.white54),
                          ),
                          Text(
                            '₹${_budget.round()}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          const Text(
                            '₹5000',
                            style: TextStyle(color: Colors.white54),
                          ),
                        ],
                      ),
                      SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          activeTrackColor: Theme.of(context).primaryColor,
                          thumbColor: Colors.white,
                        ),
                        child: Slider(
                          value: _budget,
                          min: 100,
                          max: 5000,
                          divisions: 49,
                          onChanged: (val) => setState(() => _budget = val),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Schedule
                      _buildSectionTitle('Schedule'),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTimeCard(
                              'Wake Up',
                              _wakeTime,
                              Icons.wb_sunny_outlined,
                              () => _selectTime(true),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildTimeCard(
                              'Bedtime',
                              _sleepTime,
                              Icons.nights_stay_outlined,
                              () => _selectTime(false),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _saveSettings,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            'Save Preferences',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildTimeCard(
    String label,
    TimeOfDay time,
    IconData icon,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withAlpha(10),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withAlpha(20)),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white70),
            const SizedBox(height: 8),
            Text(
              time.format(context),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: Colors.white.withAlpha(100),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
