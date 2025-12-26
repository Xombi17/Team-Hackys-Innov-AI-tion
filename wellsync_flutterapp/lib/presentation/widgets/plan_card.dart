import 'package:flutter/material.dart';
import 'dart:ui';

enum PlanType { fitness, nutrition, sleep, mental }

class PlanCard extends StatelessWidget {
  final PlanType type;
  final String title;
  final String subtitle;
  final String value;
  final Color accentColor;
  final VoidCallback? onTap;

  const PlanCard({
    super.key,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.accentColor,
    this.onTap,
  });

  IconData get _icon {
    switch (type) {
      case PlanType.fitness:
        return Icons.fitness_center;
      case PlanType.nutrition:
        return Icons.restaurant_menu;
      case PlanType.sleep:
        return Icons.bedtime;
      case PlanType.mental:
        return Icons.psychology;
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        // width: 160, // REMOVED for Grid
        // margin: const EdgeInsets.only(right: 14), // REMOVED for Grid
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    accentColor.withAlpha(40),
                    Colors.white.withAlpha(10),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: accentColor.withAlpha(60), width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: accentColor.withAlpha(50),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(_icon, color: accentColor, size: 22),
                      ),
                      if (onTap != null)
                        Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white.withAlpha(100),
                          size: 14,
                        ),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.white.withAlpha(150),
                      fontSize: 11,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: accentColor.withAlpha(60),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      value,
                      style: const TextStyle(
                        color: Colors.white,
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
      ),
    );
  }
}
