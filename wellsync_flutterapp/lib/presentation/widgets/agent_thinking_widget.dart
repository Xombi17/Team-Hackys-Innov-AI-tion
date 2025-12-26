import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'network_painter.dart';

class AgentThinkingWidget extends StatefulWidget {
  final double size;
  final Color color;

  const AgentThinkingWidget({
    super.key,
    this.size = 200,
    this.color = const Color(0xFF6366F1), // Indigo-500
  });

  @override
  State<AgentThinkingWidget> createState() => _AgentThinkingWidgetState();
}

class _AgentThinkingWidgetState extends State<AgentThinkingWidget>
    with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _pulseController;
  int _statusIndex = 0;
  Timer? _statusTimer;

  static const List<String> _statuses = [
    "Fitness Agent: Analyzing biometrics...",
    "Nutrition Agent: Calculating macros...",
    "Sleep Agent: Optimizing circadian rhythm...",
    "Mental Agent: Assessing stress levels...",
    "Coordinator: Synthesizing plan...",
    "Finalizing personalized recommendations...",
  ];

  static const List<IconData> _agentIcons = [
    Icons.fitness_center,
    Icons.restaurant,
    Icons.bedtime,
    Icons.psychology,
  ];

  @override
  void initState() {
    super.initState();
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _statusTimer = Timer.periodic(const Duration(milliseconds: 800), (timer) {
      setState(() {
        _statusIndex = (_statusIndex + 1) % _statuses.length;
      });
    });
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _pulseController.dispose();
    _statusTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Central Core Pulse
              ScaleTransition(
                scale: Tween<double>(begin: 0.8, end: 1.1).animate(
                  CurvedAnimation(
                    parent: _pulseController,
                    curve: Curves.easeInOut,
                  ),
                ),
                child: Container(
                  width: widget.size * 0.3,
                  height: widget.size * 0.3,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: widget.color.withAlpha(100),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [widget.color, widget.color.withAlpha(150)],
                    ),
                  ),
                  child: const Icon(
                    Icons.auto_awesome,
                    color: Colors.white,
                    size: 30,
                  ),
                ),
              ),

              // Neural Network Connections
              AnimatedBuilder(
                animation: _rotationController,
                builder: (context, child) {
                  return CustomPaint(
                    size: Size(widget.size, widget.size),
                    painter: NetworkPainter(
                      color: widget.color.withAlpha(100),
                      agentCount: _agentIcons.length,
                      rotation: _rotationController.value * 2 * math.pi,
                      radius: 70,
                    ),
                  );
                },
              ),

              // Orbiting Agents
              AnimatedBuilder(
                animation: _rotationController,
                builder: (context, child) {
                  return Stack(
                    children: List.generate(_agentIcons.length, (index) {
                      final double angle =
                          (index * 2 * math.pi / _agentIcons.length) +
                          (_rotationController.value * 2 * math.pi);
                      const double radius = 70; // Orbit radius

                      return Positioned(
                        left:
                            (widget.size / 2) + (radius * math.cos(angle)) - 20,
                        top:
                            (widget.size / 2) + (radius * math.sin(angle)) - 20,
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E1B4B), // Dark Navy
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: widget.color.withAlpha(100),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: widget.color.withAlpha(50),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: Icon(
                            _agentIcons[index],
                            color: Colors.white70,
                            size: 20,
                          ),
                        ),
                      );
                    }),
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Status Text
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 500),
          child: Text(
            _statuses[_statusIndex],
            key: ValueKey<int>(_statusIndex),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
              letterSpacing: 0.5,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          "Orchestrating plans...",
          style: TextStyle(color: Colors.white.withAlpha(100), fontSize: 12),
        ),
      ],
    );
  }
}
