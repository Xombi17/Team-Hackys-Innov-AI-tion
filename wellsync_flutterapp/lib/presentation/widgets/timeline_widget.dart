import 'package:flutter/material.dart';
import '../../domain/wellness_plan.dart';
import 'app_glass_card.dart';

class TimelineWidget extends StatelessWidget {
  final WellnessPlan plan;

  const TimelineWidget({super.key, required this.plan});

  @override
  Widget build(BuildContext context) {
    final events = <_TimelineEvent>[];

    // Build timeline from plan data
    if (plan.sleep?.wakeTime != null) {
      events.add(
        _TimelineEvent(
          title: 'Wake Up',
          time: plan.sleep!.wakeTime!,
          icon: Icons.wb_sunny,
          color: Colors.orange,
        ),
      );
    }

    if (plan.mental?.focus != null) {
      events.add(
        _TimelineEvent(
          title: 'Mindfulness',
          time: '08:00 AM',
          icon: Icons.self_improvement,
          color: Colors.purple,
          subtitle: plan.mental!.focus,
        ),
      );
    }

    if (plan.fitness?.type != null) {
      events.add(
        _TimelineEvent(
          title: 'Workout',
          time: '09:00 AM',
          icon: Icons.fitness_center,
          color: Colors.blue,
          subtitle: plan.fitness!.type,
        ),
      );
    }

    if (plan.nutrition?.meals != null && plan.nutrition!.meals!.isNotEmpty) {
      events.add(
        _TimelineEvent(
          title: 'Nutrition',
          time: '12:00 PM',
          icon: Icons.restaurant,
          color: Colors.green,
          subtitle: '${plan.nutrition!.dailyCalories ?? 2000} kcal target',
        ),
      );
    }

    if (plan.sleep?.bedtime != null) {
      events.add(
        _TimelineEvent(
          title: 'Sleep',
          time: plan.sleep!.bedtime!,
          icon: Icons.bed,
          color: Colors.indigo,
          subtitle: '${plan.sleep!.targetHours ?? 8} hours target',
        ),
      );
    }

    if (events.isEmpty) {
      return const Center(
        child: Text(
          'Generate a plan to see your timeline',
          style: TextStyle(color: Colors.white54),
        ),
      );
    }

    return Column(
      children: events.asMap().entries.map((entry) {
        final index = entry.key;
        final event = entry.value;
        final isLast = index == events.length - 1;
        return _buildTimelineItem(event, isLast);
      }).toList(),
    );
  }

  Widget _buildTimelineItem(_TimelineEvent event, bool isLast) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Time Column
          SizedBox(
            width: 60,
            child: Text(
              event.time,
              style: TextStyle(
                color: Colors.white.withAlpha(180),
                fontWeight: FontWeight.w600,
                fontSize: 11,
              ),
              textAlign: TextAlign.right,
            ),
          ),
          const SizedBox(width: 12),

          // Timeline indicator
          Column(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: event.color.withAlpha(51),
                  shape: BoxShape.circle,
                  border: Border.all(color: event.color, width: 2),
                ),
                child: Icon(event.icon, size: 14, color: Colors.white),
              ),
              if (!isLast)
                Container(
                  width: 2,
                  height: 40,
                  color: Colors.white.withAlpha(25),
                ),
            ],
          ),
          const SizedBox(width: 12),

          // Event Card
          Expanded(
            child: AppGlassCard(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  if (event.subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      event.subtitle!,
                      style: TextStyle(
                        color: Colors.white.withAlpha(150),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineEvent {
  final String title;
  final String time;
  final IconData icon;
  final Color color;
  final String? subtitle;

  _TimelineEvent({
    required this.title,
    required this.time,
    required this.icon,
    required this.color,
    this.subtitle,
  });
}
