import 'package:flutter/material.dart';

/// Status pill widget for Overview screen
class StatusPill extends StatelessWidget {
  final IconData? icon;
  final String label;
  final bool isActive;
  final Color? activeColor;

  const StatusPill({
    super.key,
    this.icon,
    required this.label,
    this.isActive = false,
    this.activeColor,
  });

  @override
  Widget build(BuildContext context) {
    final color = activeColor ?? Theme.of(context).primaryColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isActive ? color.withAlpha(40) : Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isActive ? color.withAlpha(100) : Colors.white.withAlpha(20),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: 14,
              color: isActive ? color : Colors.white.withAlpha(150),
            ),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: isActive ? color : Colors.white.withAlpha(150),
              fontSize: 12,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
