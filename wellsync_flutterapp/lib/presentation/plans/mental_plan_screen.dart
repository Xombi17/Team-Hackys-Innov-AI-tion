import 'package:flutter/material.dart';
import '../../domain/wellness_plan.dart';
import '../widgets/app_glass_card.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/wellness_provider.dart';

class MentalPlanScreen extends ConsumerStatefulWidget {
  final MentalPlan plan;

  const MentalPlanScreen({super.key, required this.plan});

  @override
  ConsumerState<MentalPlanScreen> createState() => _MentalPlanScreenState();
}

class _MentalPlanScreenState extends ConsumerState<MentalPlanScreen> {
  int _currentMood = 3; // 1-5 scale
  // Removed local _completedPractices

  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => ref.read(currentWellnessProvider).loadCompletedTasks(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    final completedTasks = wellnessState.completedTasks;
    final planId = wellnessState.plan?.planId ?? 'unknown';
    final startId = 'mental_${planId}_';

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF3B1E4B), Color(0xFF0F172A)],
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
                      color: Colors.purple.withAlpha(40),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.psychology, color: Colors.purple),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mental Wellness',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          widget.plan.focus ?? 'Mindfulness',
                          style: TextStyle(
                            color: Colors.purple.shade300,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.purple.withAlpha(50),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.psychology,
                      color: Colors.purple,
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
                    // Mood Tracker
                    Text(
                      "How are you feeling?",
                      style: TextStyle(
                        color: Colors.white.withAlpha(200),
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    AppGlassCard(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: List.generate(5, (index) {
                                final isSelected = _currentMood == index + 1;
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _currentMood = index + 1;
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? _getMoodColor(
                                              index + 1,
                                            ).withAlpha(100)
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected
                                            ? _getMoodColor(index + 1)
                                            : Colors.transparent,
                                        width: 2,
                                      ),
                                    ),
                                    child: Text(
                                      _getMoodEmoji(index + 1),
                                      style: TextStyle(
                                        fontSize: isSelected ? 36 : 28,
                                      ),
                                    ),
                                  ),
                                );
                              }),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _getMoodText(_currentMood),
                              style: TextStyle(
                                color: _getMoodColor(_currentMood),
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Recommendation
                    if (widget.plan.recommendation != null)
                      AppGlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Icon(
                                Icons.lightbulb_outline,
                                color: Colors.amber.shade300,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  widget.plan.recommendation!,
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

                    const SizedBox(height: 24),

                    // Daily Activities (Dynamic)
                    Text(
                      "Daily Practices",
                      style: TextStyle(
                        color: Colors.white.withAlpha(200),
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    if (widget.plan.practices != null &&
                        widget.plan.practices!.isNotEmpty)
                      ...widget.plan.practices!.asMap().entries.map((entry) {
                        final index = entry.key;
                        final practice = entry.value;
                        final name = (practice is Map
                            ? (practice['name']?.toString() ?? 'Practice')
                            : practice.toString());
                        final duration = (practice is Map
                            ? (practice['duration']?.toString() ?? '10 mins')
                            : '10 mins');
                        final taskId = '$startId$index';
                        final isComplete = completedTasks.contains(taskId);

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: GestureDetector(
                            onTap: () {
                              ref
                                  .read(currentWellnessProvider)
                                  .toggleTask(taskId);
                            },
                            child: AppGlassCard(
                              child: Padding(
                                padding: const EdgeInsets.all(20),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 60,
                                      height: 60,
                                      decoration: BoxDecoration(
                                        color: isComplete
                                            ? Colors.green.withAlpha(50)
                                            : Colors.purple.withAlpha(50),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Icon(
                                        isComplete
                                            ? Icons.check
                                            : Icons.self_improvement,
                                        color: isComplete
                                            ? Colors.green
                                            : Colors.purple,
                                        size: 30,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            name, // Display actual practice name
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                              decoration: isComplete
                                                  ? TextDecoration.lineThrough
                                                  : null,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            duration, // Display actual duration
                                            style: TextStyle(
                                              color: Colors.white.withAlpha(
                                                150,
                                              ),
                                              fontSize: 13,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Icon(
                                      Icons.play_circle_fill,
                                      color: isComplete
                                          ? Colors.green
                                          : Colors.purple.shade300,
                                      size: 32,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      })
                    else ...[
                      // Fallback if empty (keep original structure for safety)
                      // ... (We can reuse the original hardcoded ones as fallback if desired,
                      // but ideally we just show "No specific practices")
                      AppGlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Text(
                            "Follow your personalized mental check-in.",
                            style: TextStyle(color: Colors.white70),
                          ),
                        ),
                      ),
                    ],

                    // Breathing Exercise
                    Text(
                      "Quick Relief",
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
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Colors.cyan.withAlpha(50),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: const Icon(
                                    Icons.air,
                                    color: Colors.cyan,
                                    size: 28,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                const Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '4-7-8 Breathing',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        'Calming technique for stress',
                                        style: TextStyle(
                                          color: Colors.white54,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Breathe in for 4 seconds\nHold for 7 seconds\nExhale for 8 seconds',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // Start Session Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Meditation session coming soon!'),
                        backgroundColor: Colors.purple.shade700,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.play_arrow),
                  label: const Text(
                    'Start Guided Session',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purple,
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

  String _getMoodEmoji(int mood) {
    switch (mood) {
      case 1:
        return '😢';
      case 2:
        return '😕';
      case 3:
        return '😐';
      case 4:
        return '🙂';
      case 5:
        return '😄';
      default:
        return '😐';
    }
  }

  String _getMoodText(int mood) {
    switch (mood) {
      case 1:
        return 'Feeling down';
      case 2:
        return 'Not great';
      case 3:
        return 'Okay';
      case 4:
        return 'Good';
      case 5:
        return 'Great!';
      default:
        return '';
    }
  }

  Color _getMoodColor(int mood) {
    switch (mood) {
      case 1:
        return Colors.red;
      case 2:
        return Colors.orange;
      case 3:
        return Colors.amber;
      case 4:
        return Colors.lightGreen;
      case 5:
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
