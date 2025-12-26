import 'dart:math' as math;
import 'package:flutter/material.dart';

class NetworkPainter extends CustomPainter {
  final Color color;
  final int agentCount;
  final double rotation;
  final double radius;

  NetworkPainter({
    required this.color,
    required this.agentCount,
    required this.rotation,
    required this.radius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    final positions = <Offset>[];

    // Calculate agent positions
    for (int i = 0; i < agentCount; i++) {
      final angle = (i * 2 * math.pi / agentCount) + rotation;
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);
      positions.add(Offset(x, y));

      // Draw line to center
      canvas.drawLine(center, Offset(x, y), paint);
    }

    // Draw lines between neighbors (Polygon effect)
    for (int i = 0; i < positions.length; i++) {
      final p1 = positions[i];
      final p2 = positions[(i + 1) % positions.length];
      canvas.drawLine(p1, p2, paint);
    }
  }

  @override
  bool shouldRepaint(covariant NetworkPainter oldDelegate) {
    return oldDelegate.rotation != rotation || oldDelegate.color != color;
  }
}
