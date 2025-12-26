import 'package:flutter/material.dart';
import 'widgets/app_glass_card.dart';
import 'widgets/domain_list_tile.dart';
import '../domain/wellness_plan.dart';

/// Screen 4: Finalized Wellness Plan
class FinalizedPlanScreen extends StatelessWidget {
  final WellnessPlan plan;

  const FinalizedPlanScreen({super.key, required this.plan});

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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back button
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
                const SizedBox(height: 24),

                // Header
                Row(
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
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Finalized Wellness Plan',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Your personalized wellness plan is ready.',
                  style: TextStyle(
                    color: Colors.white.withAlpha(150),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 28),

                // Domain Cards
                _buildDomainCard(
                  icon: Icons.fitness_center,
                  iconColor: Colors.blue,
                  title: 'Fitness',
                  subtitle: plan.fitness?.type ?? 'Light walk + mobility',
                ),
                _buildDomainCard(
                  icon: Icons.restaurant_menu,
                  iconColor: Colors.green,
                  title: 'Nutrition',
                  subtitle: plan.nutrition?.hydration ?? 'Balanced meals',
                  badge: 'no deficit',
                  badgeColor: Colors.green,
                ),
                _buildDomainCard(
                  icon: Icons.bedtime,
                  iconColor: Colors.indigo,
                  title: 'Sleep',
                  subtitle: 'Early bedtime (${plan.sleep?.bedtime ?? "22:30"})',
                ),
                _buildDomainCard(
                  icon: Icons.psychology,
                  iconColor: Colors.purple,
                  title: 'Mental Wellness',
                  subtitle:
                      plan.mental?.recommendation ??
                      'Low pressure day, short mindfulness',
                ),

                const SizedBox(height: 28),

                // Why this plan section
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
                              'Why this plan?',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Icon(
                              Icons.keyboard_arrow_down,
                              color: Colors.white.withAlpha(150),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildReasonItem('You slept less than your baseline.'),
                        _buildReasonItem(
                          'Energy levels were reported as medium-low.',
                        ),
                        _buildReasonItem(
                          'System prioritized recovery over performance.',
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Edit link
                Center(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(
                      'Edit (or) regenerate plan',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDomainCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    String? badge,
    Color? badgeColor,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: AppGlassCard(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: DomainListTile(
            icon: icon,
            iconColor: iconColor,
            title: title,
            subtitle: subtitle,
            badge: badge,
            badgeColor: badgeColor,
          ),
        ),
      ),
    );
  }

  Widget _buildReasonItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 6),
            width: 4,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white.withAlpha(150),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                color: Colors.white.withAlpha(150),
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
