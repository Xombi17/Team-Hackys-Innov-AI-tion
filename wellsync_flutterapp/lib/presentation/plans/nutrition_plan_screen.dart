import 'package:flutter/material.dart';
import '../../domain/wellness_plan.dart';
import '../widgets/app_glass_card.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/wellness_provider.dart';

class NutritionPlanScreen extends ConsumerStatefulWidget {
  final NutritionPlan plan;

  const NutritionPlanScreen({super.key, required this.plan});

  @override
  ConsumerState<NutritionPlanScreen> createState() =>
      _NutritionPlanScreenState();
}

class _NutritionPlanScreenState extends ConsumerState<NutritionPlanScreen> {
  // Removed local _loggedMeals

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

    // Sample meals
    final meals = _generateMeals(widget.plan.meals);
    final startId = 'nutrition_${planId}_';

    // Calculate calories consumed
    int consumedCalories = 0;
    for (int i = 0; i < meals.length; i++) {
      if (completedTasks.contains('$startId$i')) {
        final cals = meals[i]['calories'];
        if (cals is int) {
          consumedCalories += cals;
        } else if (cals is String) {
          // strip non-digits
          final justNums = cals.replaceAll(RegExp(r'[^0-9]'), '');
          consumedCalories += int.tryParse(justNums) ?? 0;
        }
      }
    }

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF1E5F3A), Color(0xFF0F172A)],
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
                      color: Colors.green.withAlpha(40),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.restaurant, color: Colors.green),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Nutrition Plan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${widget.plan.dailyCalories ?? 2200} kcal Daily Goal',
                          style: TextStyle(
                            color: Colors.green.shade300,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.withAlpha(50),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.restaurant,
                      color: Colors.green,
                      size: 28,
                    ),
                  ),
                ],
              ),
            ),

            // Macros Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: AppGlassCard(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildMacro(
                        'Calories',
                        '$consumedCalories/${widget.plan.dailyCalories ?? 2200}',
                        Colors.orange,
                      ),
                      // Mock protein/carbs as they aren't parsed explicitly from text yet, unless we parse details
                      _buildMacro(
                        'Protein',
                        '${(widget.plan.dailyCalories ?? 2000) ~/ 16}g',
                        Colors.red,
                      ),
                      _buildMacro(
                        'Carbs',
                        '${(widget.plan.dailyCalories ?? 2000) ~/ 9}g',
                        Colors.blue,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Hydration
            if (widget.plan.hydration != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: AppGlassCard(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.water_drop,
                          color: Colors.lightBlueAccent,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            widget.plan.hydration!,
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

            // Meal List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  "Today's Meals",
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
                itemCount: meals.length,
                itemBuilder: (context, index) {
                  final meal = meals[index];
                  final taskId = '$startId$index';
                  final isLogged = completedTasks.contains(taskId);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GestureDetector(
                      onTap: () {
                        ref.read(currentWellnessProvider).toggleTask(taskId);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Logged ${meal['name']} - ${meal['calories']} kcal',
                            ),
                            backgroundColor: Colors.green.shade700,
                            behavior: SnackBarBehavior.floating,
                            duration: const Duration(seconds: 1),
                          ),
                        );
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
                                  color: isLogged
                                      ? Colors.green.withAlpha(50)
                                      : (meal['color'] as Color).withAlpha(30),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  isLogged
                                      ? Icons.check
                                      : meal['icon'] as IconData,
                                  color: isLogged
                                      ? Colors.green
                                      : (meal['color'] as Color),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      meal['name'] as String,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        decoration: isLogged
                                            ? TextDecoration.lineThrough
                                            : null,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      meal['description'] as String,
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
                                  color: Colors.green.withAlpha(30),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '${meal['calories']} kcal',
                                  style: TextStyle(
                                    color: Colors.green.shade300,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
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

            // Log Meal Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Food logging coming soon!'),
                        backgroundColor: Colors.green.shade700,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.add),
                  label: const Text(
                    'Log Custom Meal',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
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

  List<Map<String, dynamic>> _generateMeals(List<dynamic>? mealsList) {
    if (mealsList != null && mealsList.isNotEmpty) {
      return mealsList.map((meal) {
        final name = meal['name'] as String? ?? 'Meal';

        // Helper to get color/icon based on name
        Color getColor() {
          final n = name.toLowerCase();
          if (n.contains('breakfast')) return Colors.orange;
          if (n.contains('lunch')) return Colors.green;
          if (n.contains('dinner')) return Colors.purple;
          if (n.contains('snack')) return Colors.amber;
          return Colors.blue;
        }

        IconData getIcon() {
          final n = name.toLowerCase();
          if (n.contains('breakfast')) return Icons.breakfast_dining;
          if (n.contains('lunch')) return Icons.lunch_dining;
          if (n.contains('dinner')) return Icons.dinner_dining;
          if (n.contains('snack')) return Icons.local_cafe; // or apple
          return Icons.restaurant;
        }

        return {
          'name': name,
          'description': meal['description'] as String? ?? 'Balanced meal',
          'calories': (meal['calories'] as num? ?? 0).toInt(),
          'icon': getIcon(),
          'color': getColor(),
        };
      }).toList();
    }

    // Fallback Only
    final targetCalories = widget.plan.dailyCalories ?? 2200;
    return [
      {
        'name': 'Breakfast',
        'description': 'Oatmeal with berries and nuts',
        'calories': (targetCalories * 0.25).round(),
        'icon': Icons.breakfast_dining,
        'color': Colors.orange,
      },
      {
        'name': 'Lunch',
        'description': 'Grilled chicken salad with quinoa',
        'calories': (targetCalories * 0.35).round(),
        'icon': Icons.lunch_dining,
        'color': Colors.green,
      },
      {
        'name': 'Dinner',
        'description': 'Baked salmon with roasted vegetables',
        'calories': (targetCalories * 0.30).round(),
        'icon': Icons.dinner_dining,
        'color': Colors.purple,
      },
      {
        'name': 'Snack',
        'description': 'Greek yogurt or fruit',
        'calories': (targetCalories * 0.10).round(),
        'icon': Icons.local_cafe,
        'color': Colors.amber,
      },
    ];
  }

  Widget _buildMacro(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
