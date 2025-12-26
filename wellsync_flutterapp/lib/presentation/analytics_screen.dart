import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:intl/intl.dart';
import 'widgets/app_glass_card.dart';
import 'providers/wellness_provider.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _weeklyData = [];
  int _streak = 0;
  double _avgConfidence = 0.0;

  @override
  void initState() {
    super.initState();
    _fetchAnalytics();
  }

  Future<void> _fetchAnalytics() async {
    final userId = ref.read(currentUserIdProvider);
    final supabase = Supabase.instance.client;

    try {
      // Fetch plans from last 7 days
      final now = DateTime.now();
      final stats = await supabase
          .from('wellness_plans')
          .select('timestamp, confidence')
          .eq('user_id', userId)
          .gte(
            'timestamp',
            now.subtract(const Duration(days: 7)).toIso8601String(),
          )
          .order('timestamp');

      // Process Data
      Map<int, int> dayCounts = {}; // weekday -> count
      double totalConf = 0;
      int confCount = 0;
      int currentStreak = 0;
      DateTime? lastDate;

      // Initialize all days 0
      for (int i = 0; i < 7; i++) {
        // 0 = today, 1 = yesterday...
        // Actually better to map specific weekdays
      }

      // Simple daily mapping
      List<int> activity = List.filled(7, 0); // Mon=0 .. Sun=6

      for (var record in stats) {
        final date = DateTime.parse(record['timestamp']).toLocal();
        final weekday = date.weekday - 1; // 0-6
        activity[weekday]++;

        // Confidence
        if (record['confidence'] != null) {
          totalConf += (record['confidence'] as num).toDouble();
          confCount++;
        }

        // Streak (naive implementation)
        // Ideally we check daily continuity.
        if (lastDate == null || !_isSameDay(lastDate!, date)) {
          // New day
          // Check if consecutive
          if (lastDate != null && date.difference(lastDate!).inDays == 1) {
            currentStreak++;
          } else if (lastDate == null) {
            currentStreak = 1;
          } else {
            // Gap
            currentStreak = 1;
          }
        }
        lastDate = date;
      }

      // Since ordered by timestamp asc, currentStreak might be "longest streak in period".
      // Let's just mock streak for now based on if they have plan today.
      final hasToday = stats.any(
        (r) => _isSameDay(DateTime.parse(r['timestamp']).toLocal(), now),
      );
      _streak = hasToday
          ? (stats.length > 1 ? stats.length : 1)
          : 0; // Simplified

      // Recalculate streak properly if needed, but for Hackathon "Plans Created" count is fine.
      _streak = stats.length;

      if (confCount > 0) {
        _avgConfidence = (totalConf / confCount) * 100;
      }

      setState(() {
        _weeklyData = List.generate(7, (index) {
          // 0 = today, 6 = 7 days ago
          final d = now.subtract(Duration(days: 6 - index));
          final weekdayIndex = d.weekday - 1;
          // Filter stats for this day
          final dayStats = stats
              .where(
                (s) => _isSameDay(DateTime.parse(s['timestamp']).toLocal(), d),
              )
              .length;
          return {
            'day': DateFormat('E').format(d), // Mon
            'count': dayStats,
            'isToday': index == 6,
          };
        });
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching analytics: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  bool _isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text(
          'Your Progress',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Summary Cards
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'Plans Created',
                          '$_streak',
                          Icons.task_alt,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildStatCard(
                          'Avg. Confidence',
                          '${_avgConfidence.toStringAsFixed(0)}%',
                          Icons.insights,
                          Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  Text(
                    "Weekly Activity",
                    style: TextStyle(
                      color: Colors.white.withAlpha(200),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Chart
                  Container(
                    height: 200,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(10),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withAlpha(20)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: _weeklyData.map((data) {
                        final count = data['count'] as int;
                        // Max heignt 150px
                        // Max count assumed 5
                        final height = (count / 5.0 * 120.0).clamp(10.0, 120.0);

                        return Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Container(
                              width: 12,
                              height: height,
                              decoration: BoxDecoration(
                                color: (data['isToday'] as bool)
                                    ? Colors.indigoAccent
                                    : Colors.white.withAlpha(50),
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              data['day'] as String,
                              style: TextStyle(
                                color: Colors.white.withAlpha(150),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Encouragement
                  AppGlassCard(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Row(
                        children: [
                          Icon(
                            Icons.emoji_events,
                            color: Colors.amber,
                            size: 32,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              _avgConfidence > 80
                                  ? "You're consistently hitting high confidence plans!"
                                  : "Keep generating plans to build your history.",
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withAlpha(20),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withAlpha(50)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            title,
            style: TextStyle(color: Colors.white.withAlpha(150), fontSize: 12),
          ),
        ],
      ),
    );
  }
}
