import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/wellness_provider.dart';
import '../../domain/wellness_plan.dart';
import '../widgets/app_glass_card.dart';

class FitnessPlanScreen extends ConsumerStatefulWidget {
  final FitnessPlan plan;

  const FitnessPlanScreen({super.key, required this.plan});

  @override
  ConsumerState<FitnessPlanScreen> createState() => _FitnessPlanScreenState();
}

class _FitnessPlanScreenState extends ConsumerState<FitnessPlanScreen> {
  // Removed local state _completedExercises

  @override
  void initState() {
    super.initState();
    // Refresh tasks on load
    Future.microtask(
      () => ref.read(currentWellnessProvider).loadCompletedTasks(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    final completedTasks = wellnessState.completedTasks;
    final planId = wellnessState.plan?.planId ?? 'unknown';

    // Sample exercises based on plan type
    final exercises = _getExercisesForPlan(widget.plan.type ?? 'General');
    final startId = 'fitness_${planId}_';

    // Calculate count based on tasks starting with this prefix
    final completedCount = exercises.asMap().entries.where((entry) {
      return completedTasks.contains('$startId${entry.key}');
    }).length;

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF1E3A5F), Color(0xFF0F172A)],
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
                      color: Colors.blue.withAlpha(40),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.fitness_center, color: Colors.blue),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Fitness Plan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          widget.plan.type ?? 'Custom Workout',
                          style: TextStyle(
                            color: Colors.blue.shade300,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withAlpha(50),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.fitness_center,
                      color: Colors.blue,
                      size: 28,
                    ),
                  ),
                ],
              ),
            ),

            // Progress Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: AppGlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '$completedCount/${exercises.length}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Exercises Completed',
                              style: TextStyle(
                                color: Colors.white.withAlpha(150),
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 70,
                            height: 70,
                            child: CircularProgressIndicator(
                              value: exercises.isEmpty
                                  ? 0
                                  : completedCount / exercises.length,
                              strokeWidth: 6,
                              backgroundColor: Colors.white.withAlpha(30),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                Colors.blue,
                              ),
                            ),
                          ),
                          Text(
                            '${exercises.isEmpty ? 0 : ((completedCount / exercises.length) * 100).round()}%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Recommendation
            if (widget.plan.recommendation != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: AppGlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Icon(
                          Icons.tips_and_updates,
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
              ),

            const SizedBox(height: 20),

            // Exercise List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Today's Exercises",
                  style: TextStyle(
                    color: Colors.white.withAlpha(200),
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: exercises.length,
                itemBuilder: (context, index) {
                  final exercise = exercises[index];
                  final taskId = '$startId$index';
                  final isCompleted = completedTasks.contains(taskId);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GestureDetector(
                      onTap: () {
                        ref.read(currentWellnessProvider).toggleTask(taskId);
                        // Force UI update handled by provider stream/state
                      },
                      child: AppGlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                width: 50,
                                height: 50,
                                decoration: BoxDecoration(
                                  color: isCompleted
                                      ? Colors.green.withAlpha(50)
                                      : Colors.blue.withAlpha(30),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  isCompleted
                                      ? Icons.check
                                      : exercise['icon'] as IconData,
                                  color: isCompleted
                                      ? Colors.green
                                      : Colors.blue,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      exercise['name'] as String,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        decoration: isCompleted
                                            ? TextDecoration.lineThrough
                                            : null,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      exercise['details'] as String,
                                      style: TextStyle(
                                        color: Colors.white.withAlpha(150),
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withAlpha(15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  exercise['duration'] as String,
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Start Workout Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Workout timer coming soon!'),
                        backgroundColor: Colors.blue.shade700,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.play_arrow),
                  label: const Text(
                    'Start Workout',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
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

  List<Map<String, dynamic>> _getExercisesForPlan(String type) {
    // If the plan has real workout data, use it
    if (widget.plan.workoutPlan != null &&
        widget.plan.workoutPlan!.isNotEmpty) {
      final wp = widget.plan.workoutPlan!;
      final List<Map<String, dynamic>> exercises = [];

      // Helper to add exercise
      void addExercise(String name, String details, IconData icon) {
        exercises.add({
          'name': name,
          'details': details,
          'duration': '5 min', // Default or parse if available
          'icon': icon,
        });
      }

      // Check for 'warmup'
      if (wp.containsKey('warmup')) {
        final warmup = wp['warmup'];
        if (warmup is String) {
          addExercise('Warm-up', warmup, Icons.directions_run);
        } else if (warmup is List) {
          for (var w in warmup) {
            addExercise('Warm-up', w.toString(), Icons.directions_run);
          }
        }
      }

      // Check for 'main' or 'exercises'
      final mainKey = wp.containsKey('main')
          ? 'main'
          : (wp.containsKey('exercises') ? 'exercises' : null);
      if (mainKey != null) {
        final main = wp[mainKey];
        if (main is List) {
          for (var ex in main) {
            String name = 'Exercise';
            String details = 'Complete sets';

            if (ex is String) {
              // format: "Pushups: 3x10"
              final parts = ex.split(':');
              name = parts[0].trim();
              details = parts.length > 1 ? parts[1].trim() : 'Standard form';
            } else if (ex is Map) {
              name = ex['name'] ?? 'Exercise';
              details = ex['reps'] ?? ex['description'] ?? 'Complete sets';
            }

            addExercise(name, details, Icons.fitness_center);
          }
        } else if (main is String) {
          addExercise('Main Workout', main, Icons.fitness_center);
        } else if (main is Map) {
          // Iterate map keys
          for (var k in main.keys) {
            addExercise(k.toString(), main[k].toString(), Icons.fitness_center);
          }
        }
      }

      // Check for 'cooldown'
      if (wp.containsKey('cooldown')) {
        final cooldown = wp['cooldown'];
        if (cooldown is String) {
          addExercise('Cool Down', cooldown, Icons.self_improvement);
        } else if (cooldown is List) {
          for (var c in cooldown) {
            addExercise('Cool Down', c.toString(), Icons.self_improvement);
          }
        }
      }

      if (exercises.isNotEmpty) return exercises;
    }

    // Fallback if empty (keep existing hardcoded logic for fallback only)
    if (type.toLowerCase().contains('cardio')) {
      return [
        {
          'name': 'Warm-up Jog',
          'details': 'Light pace to get heart rate up',
          'duration': '5 min',
          'icon': Icons.directions_run,
        },
        // ... (truncated fallback)
      ];
    }
    // Return minimal fallback to avoid errors if completely unknown
    return [
      {
        'name': 'Warm-up',
        'details': 'Dynamic stretching',
        'duration': '5 min',
        'icon': Icons.self_improvement,
      },
      {
        'name': 'Core Workout',
        'details': 'See full plan details',
        'duration': '20 min',
        'icon': Icons.fitness_center,
      },
    ];
  }
}
