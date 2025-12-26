import 'package:flutter/material.dart';
import '../../domain/wellness_plan.dart';
import '../widgets/app_glass_card.dart';

class SleepPlanScreen extends StatefulWidget {
  final SleepPlan plan;

  const SleepPlanScreen({super.key, required this.plan});

  @override
  State<SleepPlanScreen> createState() => _SleepPlanScreenState();
}

class _SleepPlanScreenState extends State<SleepPlanScreen> {
  int _sleepQuality = 0; // 0-5 stars
  bool _loggedSleep = false;

  @override
  Widget build(BuildContext context) {
    final targetHours = widget.plan.targetHours ?? 8;
    final bedtime = widget.plan.bedtime ?? '10:30 PM';
    final wakeTime = widget.plan.wakeTime ?? '6:30 AM';

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF312E81)],
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
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withAlpha(40),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.bedtime, color: Colors.indigo),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Sleep Plan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '$targetHours hours target',
                          style: TextStyle(
                            color: Colors.indigo.shade300,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withAlpha(50),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.bedtime,
                      color: Colors.indigo,
                      size: 28,
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sleep Schedule Card
                    AppGlassCard(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.nights_stay,
                                    color: Colors.indigo.shade300,
                                    size: 32,
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Bedtime',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    bedtime,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              width: 1,
                              height: 80,
                              color: Colors.white.withAlpha(30),
                            ),
                            Expanded(
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.wb_sunny,
                                    color: Colors.amber.shade300,
                                    size: 32,
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Wake Up',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    wakeTime,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Sleep Duration
                    AppGlassCard(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.access_time,
                              color: Colors.indigo.shade200,
                              size: 40,
                            ),
                            const SizedBox(width: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Sleep Duration',
                                  style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 14,
                                  ),
                                ),
                                Text(
                                  '$targetHours hours',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Log Sleep Quality
                    Text(
                      'How did you sleep?',
                      style: TextStyle(
                        color: Colors.white.withAlpha(200),
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    AppGlassCard(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(5, (index) {
                                final isFilled = index < _sleepQuality;
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _sleepQuality = index + 1;
                                    });
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                    ),
                                    child: Icon(
                                      isFilled ? Icons.star : Icons.star_border,
                                      color: isFilled
                                          ? Colors.amber
                                          : Colors.white30,
                                      size: 40,
                                    ),
                                  ),
                                );
                              }),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _sleepQuality == 0
                                  ? 'Tap to rate your sleep'
                                  : _getSleepQualityText(_sleepQuality),
                              style: TextStyle(
                                color: _sleepQuality == 0
                                    ? Colors.white54
                                    : Colors.white,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Sleep Tips
                    Text(
                      'Sleep Tips',
                      style: TextStyle(
                        color: Colors.white.withAlpha(200),
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    ..._getSleepTips().map(
                      (tip) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: AppGlassCard(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.indigo.withAlpha(50),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    tip['icon'] as IconData,
                                    color: Colors.indigo.shade200,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Text(
                                    tip['text'] as String,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // Log Sleep Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _loggedSleep
                      ? null
                      : () {
                          if (_sleepQuality == 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Please rate your sleep quality first',
                                ),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                            return;
                          }
                          setState(() {
                            _loggedSleep = true;
                          });
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: const Text('Sleep logged successfully!'),
                              backgroundColor: Colors.indigo.shade700,
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                  icon: Icon(_loggedSleep ? Icons.check : Icons.add),
                  label: Text(
                    _loggedSleep ? 'Sleep Logged' : 'Log Last Night\'s Sleep',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _loggedSleep
                        ? Colors.green
                        : Colors.indigo,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getSleepQualityText(int rating) {
    switch (rating) {
      case 1:
        return 'Poor - You struggled to sleep';
      case 2:
        return 'Fair - Could have been better';
      case 3:
        return 'Good - Decent rest';
      case 4:
        return 'Great - Well rested';
      case 5:
        return 'Excellent - Best sleep ever!';
      default:
        return '';
    }
  }

  List<Map<String, dynamic>> _getSleepTips() {
    return [
      {
        'icon': Icons.phone_android,
        'text': 'Put away screens 1 hour before bed',
      },
      {'icon': Icons.ac_unit, 'text': 'Keep room temperature cool (65-68°F)'},
      {'icon': Icons.coffee_outlined, 'text': 'Avoid caffeine after 2 PM'},
      {'icon': Icons.schedule, 'text': 'Maintain consistent sleep schedule'},
      {
        'icon': Icons.self_improvement,
        'text': 'Try relaxation techniques before bed',
      },
    ];
  }
}
