import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../main.dart';
import 'widgets/app_glass_card.dart';

/// History Screen - Shows past wellness plans and adaptation history
class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  List<_PlanHistory> _history = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final user = supabase.auth.currentUser;
      if (user == null) {
        setState(() => _isLoading = false);
        return;
      }

      // Fetch plans
      final response = await supabase
          .from('wellness_plans')
          .select()
          .eq('user_id', user.id)
          .order('timestamp', ascending: false)
          .limit(10);

      // Fetch feedback (optional optimization: fetch all or join if possible)
      // For now, we'll just verify if there's any feedback for these
      // Since linking is tricky without explicit FKs in the Python script's current mock schema,
      // we will assume 'Accepted' if it exists in history for now, or just show 'Generated'.

      final List<_PlanHistory> loadedHistory = [];

      for (final row in response) {
        try {
          final planData = row['plan_data']; // This might be a Map or String
          final Map<String, dynamic> plan = (planData is String)
              ? Map<String, dynamic>.from(jsonDecode(planData))
              : Map<String, dynamic>.from(planData);

          // robust parsing
          String summary = 'Wellness Plan';
          List<String> tags = ['Daily Plan'];

          if (plan.containsKey('fitness')) {
            final fit = plan['fitness'] is Map ? plan['fitness'] : {};
            if (fit['workout_type'] != null)
              tags.add(fit['workout_type'].toString());
          }

          if (plan.containsKey('nutrition')) {
            final nut = plan['nutrition'] is Map ? plan['nutrition'] : {};
            if (nut['diet_type'] != null) tags.add(nut['diet_type'].toString());
          }

          // Create a summary string
          final fitTitle = plan['fitness']?['workout_type'] ?? 'Workout';
          final mealTitle = plan['nutrition']?['diet_type'] ?? 'Meals';
          summary = '$fitTitle, $mealTitle';

          loadedHistory.add(
            _PlanHistory(
              date: DateTime.parse(
                row['timestamp'] ?? DateTime.now().toIso8601String(),
              ),
              tags: tags.take(3).toList(),
              summary: summary,
              accepted:
                  true, // Defaulting to true as we are showing generated plans
              planData: plan, // Keep raw data for details
            ),
          );
        } catch (e) {
          debugPrint('Error parsing plan row: $e');
        }
      }

      if (mounted) {
        setState(() {
          _history = loadedHistory;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching history: $e');
      if (mounted) setState(() => _isLoading = false);
    }
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
            crossAxisAlignment: CrossAxisAlignment.start,
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
                        'History',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Loading or Content
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _history.isEmpty
                    ? Center(
                        child: Text(
                          'No history yet',
                          style: TextStyle(color: Colors.white.withAlpha(100)),
                        ),
                      )
                    : Column(
                        children: [
                          // Stats summary
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Row(
                              children: [
                                _buildStatCard(
                                  'Plans',
                                  '${_history.length}',
                                  Icons.auto_awesome,
                                ),
                                const SizedBox(width: 12),
                                _buildStatCard(
                                  'Active',
                                  '${_history.length}',
                                  Icons.check_circle,
                                ),
                                const SizedBox(width: 12),
                                _buildStatCard(
                                  'Streak',
                                  '${_history.length > 0 ? 1 : 0} day',
                                  Icons.local_fire_department,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // History list
                          Expanded(
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              itemCount: _history.length,
                              itemBuilder: (context, index) =>
                                  _buildHistoryCard(_history[index]),
                            ),
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

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: AppGlassCard(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Icon(icon, color: Theme.of(context).primaryColor, size: 20),
              const SizedBox(height: 8),
              Text(
                value,
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
                  fontSize: 10,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHistoryCard(_PlanHistory history) {
    final dateStr = DateFormat('EEEE, MMM d').format(history.date);
    final isToday =
        history.date.day == DateTime.now().day &&
        history.date.month == DateTime.now().month;

    return GestureDetector(
      onTap: () => _showPlanDetails(history),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withAlpha(8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isToday
                ? Theme.of(context).primaryColor.withAlpha(50)
                : Colors.white.withAlpha(10),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Date and status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isToday ? 'Today' : dateStr,
                  style: TextStyle(
                    color: isToday
                        ? Theme.of(context).primaryColor
                        : Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.withAlpha(30),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.check, color: Colors.green, size: 12),
                      SizedBox(width: 4),
                      Text(
                        'Generated',
                        style: TextStyle(color: Colors.green, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Tags
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: history.tags.map((tag) {
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withAlpha(20),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    tag,
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 10),

            // Summary
            Text(
              history.summary,
              style: TextStyle(
                color: Colors.white.withAlpha(150),
                fontSize: 13,
              ),
            ),

            // Chevron
            Align(
              alignment: Alignment.centerRight,
              child: Icon(
                Icons.chevron_right,
                color: Colors.white.withAlpha(50),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showPlanDetails(_PlanHistory history) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Color(0xFF1E1B4B),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(30),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Date
            Text(
              DateFormat('EEEE, MMMM d, yyyy').format(history.date),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // Tags
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: history.tags.map((tag) {
                return Chip(
                  label: Text(tag),
                  backgroundColor: Theme.of(context).primaryColor.withAlpha(30),
                  labelStyle: TextStyle(color: Theme.of(context).primaryColor),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Summary
            Text(
              'Plan Summary',
              style: TextStyle(
                color: Colors.white.withAlpha(100),
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              history.summary,
              style: const TextStyle(color: Colors.white, fontSize: 15),
            ),
            const SizedBox(height: 24),

            // Raw Details (Placeholder for rich view)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Details',
                    style: TextStyle(
                      color: Colors.white70,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Deep Dive: ${history.tags.join(", ")}',
                    style: const TextStyle(color: Colors.white54),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Note: Read-only view
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: Colors.white.withAlpha(100),
                    size: 18,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'This is a historical snapshot. Plans cannot be regenerated from history.',
                      style: TextStyle(
                        color: Colors.white.withAlpha(100),
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _PlanHistory {
  final DateTime date;
  final List<String> tags;
  final String summary;
  final bool accepted;
  final Map<String, dynamic> planData;

  _PlanHistory({
    required this.date,
    required this.tags,
    required this.summary,
    required this.accepted,
    required this.planData,
  });
}
