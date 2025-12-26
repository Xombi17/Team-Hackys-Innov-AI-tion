import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../main.dart';
import 'widgets/app_glass_card.dart';

class EditProfileScreen extends StatefulWidget {
  final Map<String, dynamic> currentProfile;
  final VoidCallback onSave;

  const EditProfileScreen({
    super.key,
    required this.currentProfile,
    required this.onSave,
  });

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameController;
  late double _height;
  late double _weight;
  late int _age;
  late String _gender;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
      text: widget.currentProfile['name'],
    );
    _height = (widget.currentProfile['height'] ?? 170).toDouble();
    _weight = (widget.currentProfile['weight'] ?? 70).toDouble();
    _age = widget.currentProfile['age'] ?? 25;
    _gender =
        widget.currentProfile['gender']?.toString().toLowerCase() ?? 'male';
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    setState(() => _isLoading = true);
    try {
      final user = supabase.auth.currentUser;
      if (user != null) {
        // 1. Update Auth Metadata (Name)
        if (_nameController.text != widget.currentProfile['name']) {
          await supabase.auth.updateUser(
            UserAttributes(data: {'name': _nameController.text}),
          );
        }

        // 2. Update Profile Table
        await supabase
            .from('user_profiles')
            .update({
              'height': _height.round(),
              'weight': _weight.round(),
              'age': _age,
              'gender': _gender,
              // Update JSON field too if it exists to keep in sync
              'profile_data': {
                ...((widget.currentProfile['profile_data'] as Map?) ?? {}),
                'height': _height.round(),
                'weight': _weight.round(),
                'age': _age,
                'gender': _gender,
              },
            })
            .eq('user_id', user.id);

        widget.onSave();
        if (mounted) Navigator.pop(context);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error saving profile: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Edit Profile'),
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
                      // Name
                      TextField(
                        controller: _nameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: 'Display Name',
                          labelStyle: TextStyle(
                            color: Colors.white.withAlpha(150),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                              color: Colors.white.withAlpha(50),
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                              color: Theme.of(context).primaryColor,
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Age
                      _buildSlider(
                        label: 'Age',
                        value: _age.toDouble(),
                        min: 16,
                        max: 80,
                        unit: 'years',
                        onChanged: (val) => setState(() => _age = val.round()),
                      ),
                      const SizedBox(height: 24),

                      // Height
                      _buildSlider(
                        label: 'Height',
                        value: _height,
                        min: 140,
                        max: 220,
                        unit: 'cm',
                        onChanged: (val) => setState(() => _height = val),
                      ),
                      const SizedBox(height: 24),

                      // Weight
                      _buildSlider(
                        label: 'Weight',
                        value: _weight,
                        min: 40,
                        max: 150,
                        unit: 'kg',
                        onChanged: (val) => setState(() => _weight = val),
                      ),
                      const SizedBox(height: 24),

                      // Gender
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Gender',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _buildGenderCard('Male', 'male', Icons.male),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildGenderCard(
                              'Female',
                              'female',
                              Icons.female,
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
                    onPressed: _isLoading ? null : _saveProfile,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            'Save Changes',
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

  Widget _buildSlider({
    required String label,
    required double value,
    required double min,
    required double max,
    required String unit,
    required Function(double) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(color: Colors.white70)),
            Text(
              '${value.round()} $unit',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: Theme.of(context).primaryColor,
            inactiveTrackColor: Colors.white.withAlpha(30),
            thumbColor: Colors.white,
            overlayColor: Theme.of(context).primaryColor.withAlpha(30),
          ),
          child: Slider(value: value, min: min, max: max, onChanged: onChanged),
        ),
      ],
    );
  }

  Widget _buildGenderCard(String label, String value, IconData icon) {
    final isSelected = _gender == value;
    return GestureDetector(
      onTap: () => setState(() => _gender = value),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected
              ? Theme.of(context).primaryColor
              : Colors.white.withAlpha(10),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? Theme.of(context).primaryColor
                : Colors.white.withAlpha(30),
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.white70,
              size: 28,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
