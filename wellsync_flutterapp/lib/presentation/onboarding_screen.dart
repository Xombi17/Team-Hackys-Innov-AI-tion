import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../main.dart';
import 'dashboard_screen.dart';
import 'widgets/app_glass_card.dart';

/// Onboarding Wizard - First-time user experience
/// Steps: Goals → Physical Data → Diet Preferences → Schedule
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  int _currentStep = 0;
  final int _totalSteps = 4;

  // Step 1: Goals
  final Set<String> _selectedGoals = {};

  // Step 2: Physical Data
  double _height = 170; // cm
  double _weight = 70; // kg
  int _age = 28;
  String _gender = 'male';

  // Step 3: Diet Preferences
  String _dietType = 'non_veg';
  int _budget = 500; // daily budget
  final Set<String> _allergies = {};

  // Step 4: Schedule
  TimeOfDay _wakeTime = const TimeOfDay(hour: 6, minute: 30);
  TimeOfDay _sleepTime = const TimeOfDay(hour: 22, minute: 30);
  int _workHours = 8;
  String _activityLevel = 'moderate';

  bool _isLoading = false;

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
              _buildHeader(),

              // Progress indicator
              _buildProgressIndicator(),

              // Step content
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _buildStepContent(),
                ),
              ),

              // Navigation buttons
              _buildNavigationButtons(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final stepTitles = [
      'Your Goals',
      'Physical Data',
      'Diet Preferences',
      'Your Schedule',
    ];

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          if (_currentStep > 0)
            GestureDetector(
              onTap: () => setState(() => _currentStep--),
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
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  stepTitles[_currentStep],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Step ${_currentStep + 1} of $_totalSteps',
                  style: TextStyle(
                    color: Colors.white.withAlpha(100),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          // Skip button (except last step)
          if (_currentStep < _totalSteps - 1)
            TextButton(
              onPressed: () => setState(() => _currentStep++),
              child: Text(
                'Skip',
                style: TextStyle(
                  color: Colors.white.withAlpha(100),
                  fontSize: 14,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: List.generate(_totalSteps, (index) {
          final isActive = index <= _currentStep;
          final isCurrent = index == _currentStep;

          return Expanded(
            child: Container(
              margin: EdgeInsets.only(right: index < _totalSteps - 1 ? 8 : 0),
              height: 4,
              decoration: BoxDecoration(
                color: isActive
                    ? Theme.of(context).primaryColor
                    : Colors.white.withAlpha(20),
                borderRadius: BorderRadius.circular(2),
                boxShadow: isCurrent
                    ? [
                        BoxShadow(
                          color: Theme.of(context).primaryColor.withAlpha(100),
                          blurRadius: 8,
                        ),
                      ]
                    : null,
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildGoalsStep();
      case 1:
        return _buildPhysicalDataStep();
      case 2:
        return _buildDietStep();
      case 3:
        return _buildScheduleStep();
      default:
        return const SizedBox();
    }
  }

  // Step 1: Goals Selection
  Widget _buildGoalsStep() {
    final goals = [
      {
        'id': 'weight_loss',
        'icon': Icons.trending_down,
        'title': 'Lose Weight',
        'subtitle': 'Burn fat & get lean',
      },
      {
        'id': 'muscle_gain',
        'icon': Icons.fitness_center,
        'title': 'Build Muscle',
        'subtitle': 'Strength & size',
      },
      {
        'id': 'energy',
        'icon': Icons.bolt,
        'title': 'More Energy',
        'subtitle': 'Feel energized daily',
      },
      {
        'id': 'sleep',
        'icon': Icons.bedtime,
        'title': 'Better Sleep',
        'subtitle': 'Improve sleep quality',
      },
      {
        'id': 'stress',
        'icon': Icons.spa,
        'title': 'Reduce Stress',
        'subtitle': 'Mental wellness',
      },
      {
        'id': 'balance',
        'icon': Icons.balance,
        'title': 'General Balance',
        'subtitle': 'Holistic health',
      },
    ];

    return SingleChildScrollView(
      key: const ValueKey('goals'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'What do you want to achieve?',
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 14),
          ),
          const SizedBox(height: 8),
          Text(
            'Select one or more goals',
            style: TextStyle(color: Colors.white.withAlpha(80), fontSize: 12),
          ),
          const SizedBox(height: 20),
          ...goals.map((goal) => _buildGoalCard(goal)),
        ],
      ),
    );
  }

  Widget _buildGoalCard(Map<String, dynamic> goal) {
    final isSelected = _selectedGoals.contains(goal['id']);

    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedGoals.remove(goal['id']);
          } else {
            _selectedGoals.add(goal['id']);
          }
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? Theme.of(context).primaryColor.withAlpha(30)
              : Colors.white.withAlpha(8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? Theme.of(context).primaryColor
                : Colors.white.withAlpha(20),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected
                    ? Theme.of(context).primaryColor.withAlpha(40)
                    : Colors.white.withAlpha(10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                goal['icon'] as IconData,
                color: isSelected
                    ? Theme.of(context).primaryColor
                    : Colors.white.withAlpha(150),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    goal['title'] as String,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    goal['subtitle'] as String,
                    style: TextStyle(
                      color: Colors.white.withAlpha(100),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle, color: Theme.of(context).primaryColor),
          ],
        ),
      ),
    );
  }

  // Step 2: Physical Data
  Widget _buildPhysicalDataStep() {
    return SingleChildScrollView(
      key: const ValueKey('physical'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tell us about yourself',
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 14),
          ),
          const SizedBox(height: 20),

          // Gender
          AppGlassCard(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Gender',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildGenderChip('male', 'Male', Icons.male),
                      const SizedBox(width: 12),
                      _buildGenderChip('female', 'Female', Icons.female),
                      const SizedBox(width: 12),
                      _buildGenderChip('other', 'Other', Icons.person),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Age
          AppGlassCard(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Age',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '$_age years',
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: _age.toDouble(),
                    min: 16,
                    max: 80,
                    onChanged: (v) => setState(() => _age = v.round()),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Height & Weight
          Row(
            children: [
              Expanded(
                child: AppGlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Height',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${_height.round()} cm',
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Slider(
                          value: _height,
                          min: 100,
                          max: 220,
                          onChanged: (v) => setState(() => _height = v),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppGlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Weight',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${_weight.round()} kg',
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Slider(
                          value: _weight,
                          min: 30,
                          max: 200,
                          onChanged: (v) => setState(() => _weight = v),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGenderChip(String value, String label, IconData icon) {
    final isSelected = _gender == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _gender = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? Theme.of(context).primaryColor.withAlpha(40)
                : Colors.transparent,
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
                color: isSelected
                    ? Theme.of(context).primaryColor
                    : Colors.white.withAlpha(100),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withAlpha(100),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Step 3: Diet Preferences
  Widget _buildDietStep() {
    final dietTypes = [
      {'id': 'veg', 'title': 'Vegetarian', 'icon': Icons.eco},
      {'id': 'non_veg', 'title': 'Non-Vegetarian', 'icon': Icons.restaurant},
      {'id': 'vegan', 'title': 'Vegan', 'icon': Icons.grass},
      {'id': 'keto', 'title': 'Keto', 'icon': Icons.egg},
    ];

    return SingleChildScrollView(
      key: const ValueKey('diet'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Your dietary preferences',
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 14),
          ),
          const SizedBox(height: 20),

          // Diet type grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: dietTypes.map((diet) {
              final isSelected = _dietType == diet['id'];
              return GestureDetector(
                onTap: () => setState(() => _dietType = diet['id'] as String),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Theme.of(context).primaryColor.withAlpha(30)
                        : Colors.white.withAlpha(8),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected
                          ? Theme.of(context).primaryColor
                          : Colors.white.withAlpha(20),
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        diet['icon'] as IconData,
                        color: isSelected
                            ? Theme.of(context).primaryColor
                            : Colors.white.withAlpha(150),
                        size: 32,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        diet['title'] as String,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 20),

          // Budget
          AppGlassCard(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Daily Food Budget',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '₹$_budget',
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: _budget.toDouble(),
                    min: 100,
                    max: 2000,
                    divisions: 19,
                    onChanged: (v) => setState(() => _budget = v.round()),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Step 4: Schedule
  Widget _buildScheduleStep() {
    final activityLevels = [
      {
        'id': 'sedentary',
        'title': 'Sedentary',
        'desc': 'Little to no exercise',
      },
      {'id': 'light', 'title': 'Light', 'desc': '1-2 days/week'},
      {'id': 'moderate', 'title': 'Moderate', 'desc': '3-5 days/week'},
      {'id': 'active', 'title': 'Very Active', 'desc': '6-7 days/week'},
    ];

    return SingleChildScrollView(
      key: const ValueKey('schedule'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Your daily routine',
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 14),
          ),
          const SizedBox(height: 20),

          // Wake & Sleep Time
          Row(
            children: [
              Expanded(
                child: _buildTimeCard('Wake Up', _wakeTime, Icons.wb_sunny, (
                  time,
                ) {
                  if (time != null) setState(() => _wakeTime = time);
                }),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildTimeCard('Bedtime', _sleepTime, Icons.bedtime, (
                  time,
                ) {
                  if (time != null) setState(() => _sleepTime = time);
                }),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Work Hours
          AppGlassCard(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Work Hours/Day',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '$_workHours hrs',
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: _workHours.toDouble(),
                    min: 0,
                    max: 16,
                    divisions: 16,
                    onChanged: (v) => setState(() => _workHours = v.round()),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Activity Level
          const Text(
            'Activity Level',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 12),
          ...activityLevels.map((level) {
            final isSelected = _activityLevel == level['id'];
            return GestureDetector(
              onTap: () =>
                  setState(() => _activityLevel = level['id'] as String),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Theme.of(context).primaryColor.withAlpha(30)
                      : Colors.white.withAlpha(8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected
                        ? Theme.of(context).primaryColor
                        : Colors.white.withAlpha(20),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          level['title'] as String,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          level['desc'] as String,
                          style: TextStyle(
                            color: Colors.white.withAlpha(100),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    if (isSelected)
                      Icon(
                        Icons.check_circle,
                        color: Theme.of(context).primaryColor,
                      ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTimeCard(
    String label,
    TimeOfDay time,
    IconData icon,
    Function(TimeOfDay?) onChanged,
  ) {
    return GestureDetector(
      onTap: () async {
        final picked = await showTimePicker(
          context: context,
          initialTime: time,
        );
        onChanged(picked);
      },
      child: AppGlassCard(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: Theme.of(context).primaryColor),
              const SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  color: Colors.white.withAlpha(100),
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                time.format(context),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationButtons() {
    final isLastStep = _currentStep == _totalSteps - 1;

    return Padding(
      padding: const EdgeInsets.all(20),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: _isLoading
              ? null
              : () => isLastStep ? _completeOnboarding() : _nextStep(),
          style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).primaryColor,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          child: _isLoading
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2,
                  ),
                )
              : Text(
                  isLastStep ? 'Complete Setup' : 'Continue',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
        ),
      ),
    );
  }

  void _nextStep() {
    if (_currentStep == 0 && _selectedGoals.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one goal')),
      );
      return;
    }
    setState(() => _currentStep++);
  }

  Future<void> _completeOnboarding() async {
    setState(() => _isLoading = true);

    try {
      // Save profile to Supabase
      final user = supabase.auth.currentUser;
      if (user != null) {
        await supabase.from('user_profiles').upsert({
          'user_id': user.id,
          'goals': _selectedGoals.toList(),
          'height': _height.round(),
          'weight': _weight.round(),
          'age': _age,
          'gender': _gender,
          'diet_type': _dietType,
          'daily_budget': _budget,
          'wake_time':
              '${_wakeTime.hour.toString().padLeft(2, '0')}:${_wakeTime.minute.toString().padLeft(2, '0')}',
          'sleep_time':
              '${_sleepTime.hour.toString().padLeft(2, '0')}:${_sleepTime.minute.toString().padLeft(2, '0')}',
          'work_hours': _workHours,
          'activity_level': _activityLevel,
          'onboarding_completed': true,
          // Populate profile_data JSON to satisfy constraint
          'profile_data': {
            'goals': _selectedGoals.toList(),
            'height': _height.round(),
            'weight': _weight.round(),
            'age': _age,
            'gender': _gender,
            'diet_type': _dietType,
            'daily_budget': _budget,
            'wake_time':
                '${_wakeTime.hour.toString().padLeft(2, '0')}:${_wakeTime.minute.toString().padLeft(2, '0')}',
            'sleep_time':
                '${_sleepTime.hour.toString().padLeft(2, '0')}:${_sleepTime.minute.toString().padLeft(2, '0')}',
            'work_hours': _workHours,
            'activity_level': _activityLevel,
          },
          'updated_at': DateTime.now().toIso8601String(),
        });

        // Update user metadata
        await supabase.auth.updateUser(
          UserAttributes(data: {'onboarding_completed': true}),
        );
      }

      // Navigate to Dashboard
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const DashboardScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error saving profile: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
