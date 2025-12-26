import 'dart:async';
import 'dart:math' as math;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/wellness_provider.dart';
import 'dashboard_screen.dart';
import 'widgets/app_glass_card.dart';
import '../main.dart';
import '../core/constants.dart';

/// Premium Agent Actions Screen with 5-Phase Animation
/// Based on production-grade animation blueprint
class AgentActionsScreen extends ConsumerStatefulWidget {
  final double sleepHours;
  final String mealsSkipped;
  final String mood;
  final String notes;

  const AgentActionsScreen({
    super.key,
    required this.sleepHours,
    required this.mealsSkipped,
    required this.mood,
    required this.notes,
  });

  @override
  ConsumerState<AgentActionsScreen> createState() => _AgentActionsScreenState();
}

class _AgentActionsScreenState extends ConsumerState<AgentActionsScreen>
    with TickerProviderStateMixin {
  // Animation controllers
  late AnimationController _orbController;
  late AnimationController _pulseController;
  late AnimationController _progressController;

  // Agent data with reasoning text
  final List<_AgentData> _agents = [
    _AgentData(
      name: 'Fitness Agent',
      icon: Icons.fitness_center,
      color: Colors.blue,
      reasoningText: 'Adjusting intensity due to recovery needs...',
    ),
    _AgentData(
      name: 'Nutrition Agent',
      icon: Icons.restaurant_menu,
      color: Colors.green,
      reasoningText: 'Maintaining calories, prioritizing easy digestion...',
    ),
    _AgentData(
      name: 'Sleep Agent',
      icon: Icons.bedtime,
      color: Colors.indigo,
      reasoningText: 'Anchoring bedtime for circadian recovery...',
    ),
    _AgentData(
      name: 'Mental Agent',
      icon: Icons.psychology,
      color: Colors.purple,
      reasoningText: 'Reducing cognitive load for today...',
    ),
    _AgentData(
      name: 'Coordinator',
      icon: Icons.hub,
      color: Colors.amber,
      reasoningText: 'Resolving trade-offs and finalizing plan...',
      isCoordinator: true,
    ),
  ];

  int _currentAgentIndex = -1; // -1 = not started
  bool _allComplete = false;
  Timer? _agentTimer;

  // Phase tracking
  int _currentPhase =
      0; // 0=init, 1=trigger, 2=context, 3=agents, 4=morph, 5=confirm

  @override
  void initState() {
    super.initState();

    _orbController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    // Start Phase 1 after a brief delay
    Future.delayed(const Duration(milliseconds: 300), () {
      _startPhase1();
    });
  }

  /// PHASE 1: Trigger feedback
  void _startPhase1() {
    setState(() => _currentPhase = 1);

    // Trigger API call
    final user = supabase.auth.currentUser;
    final wellnessNotifier = ref.read(currentWellnessProvider);

    wellnessNotifier.generatePlan({
      'name': user?.userMetadata?['name'] ?? 'User',
      'user_id': user?.id ?? 'demo_user',
      'age': 28,
      'fitness_level': 'intermediate',
      'goals': ['recovery', 'balanced_nutrition', 'better_sleep'],
      'sleep_hours': widget.sleepHours,
      'meals_skipped': widget.mealsSkipped,
      'mood': widget.mood,
      'notes': widget.notes,
    });

    // Move to Phase 2 after 500ms
    Future.delayed(const Duration(milliseconds: 500), () {
      _startPhase2();
    });
  }

  /// PHASE 2: Context lock & transition
  void _startPhase2() {
    setState(() => _currentPhase = 2);

    // Move to Phase 3 after 1s
    Future.delayed(const Duration(seconds: 1), () {
      _startPhase3();
    });
  }

  /// PHASE 3: Sequential agent execution
  void _startPhase3() {
    setState(() {
      _currentPhase = 3;
      _currentAgentIndex = 0;
    });

    _progressController.forward();

    // Animate each agent sequentially (700ms each, 1000ms for coordinator)
    _agentTimer = Timer.periodic(const Duration(milliseconds: 800), (timer) {
      if (_currentAgentIndex < _agents.length - 1) {
        setState(() {
          _agents[_currentAgentIndex].isComplete = true;
          _currentAgentIndex++;
        });
        _progressController.reset();
        _progressController.forward();
      } else {
        // Last agent (Coordinator) takes longer
        timer.cancel();
        Future.delayed(const Duration(milliseconds: 1200), () {
          setState(() {
            _agents[_currentAgentIndex].isComplete = true;
            _allComplete = true;
          });
          _startPhase4();
        });
      }
    });
  }

  /// PHASE 4: Plan transformation
  void _startPhase4() {
    setState(() => _currentPhase = 4);

    // Move to Phase 5 after morphing
    Future.delayed(const Duration(milliseconds: 800), () {
      _startPhase5();
    });
  }

  /// PHASE 5: Confirmation & control
  void _startPhase5() {
    setState(() => _currentPhase = 5);
  }

  @override
  void dispose() {
    _orbController.dispose();
    _pulseController.dispose();
    _progressController.dispose();
    _agentTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final wellnessState = ref.watch(currentWellnessStateProvider);

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
            children: [
              // Header
              _buildHeader(),

              // Main content
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 400),
                  child: _buildPhaseContent(wellnessState),
                ),
              ),

              // Action buttons (Phase 5 only)
              if (_currentPhase >= 5 && wellnessState.plan != null)
                _buildActionButtons(wellnessState),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
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
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Agents Working',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                AnimatedOpacity(
                  opacity: _currentPhase >= 2 ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 300),
                  child: Text(
                    _getPhaseSubtitle(),
                    style: TextStyle(
                      color: Colors.white.withAlpha(100),
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getPhaseSubtitle() {
    switch (_currentPhase) {
      case 1:
        return 'Initiating...';
      case 2:
        return 'Re-evaluating today\'s plan...';
      case 3:
        return 'Agents are reasoning...';
      case 4:
        return 'Finalizing recommendations...';
      case 5:
        return 'Plan ready for review';
      default:
        return '';
    }
  }

  Widget _buildPhaseContent(WellnessState wellnessState) {
    return SingleChildScrollView(
      key: ValueKey(_currentPhase),
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          // Context message (Phase 2+)
          if (_currentPhase >= 2)
            AnimatedOpacity(
              opacity: _currentPhase >= 2 ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 400),
              child: _buildContextMessage(),
            ),

          const SizedBox(height: 24),

          // Agent list with animations
          ..._agents.asMap().entries.map((entry) {
            final index = entry.key;
            final agent = entry.value;
            return _buildAgentTile(agent, index, wellnessState);
          }),

          const SizedBox(height: 24),

          // Central orb (during processing)
          if (_currentPhase >= 3 && !_allComplete) _buildAnimatedOrb(),

          // Plan preview (Phase 4+)
          if (_currentPhase >= 4 && wellnessState.plan != null)
            _buildPlanPreview(wellnessState),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildContextMessage() {
    return AppGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withAlpha(40),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.auto_awesome,
                color: Theme.of(context).primaryColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Refining your wellness plan',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Based on updated sleep, energy, and your preferences',
                    style: TextStyle(
                      color: Colors.white.withAlpha(120),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAgentTile(
    _AgentData agent,
    int index,
    WellnessState wellnessState,
  ) {
    final isActive = index == _currentAgentIndex && _currentPhase == 3;
    final isVisible = _currentPhase >= 3 || index <= _currentAgentIndex;
    final isComplete = agent.isComplete;

    // Stagger animation
    return AnimatedOpacity(
      opacity: _currentPhase >= 3 ? 1.0 : 0.3,
      duration: Duration(milliseconds: 300 + (index * 100)),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isActive
              ? agent.color.withAlpha(20)
              : Colors.white.withAlpha(isComplete ? 8 : 5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isActive
                ? agent.color.withAlpha(100)
                : isComplete
                ? agent.color.withAlpha(50)
                : Colors.white.withAlpha(10),
            width: isActive ? 1.5 : 1,
          ),
        ),
        child: Column(
          children: [
            Row(
              children: [
                // Icon with glow
                AnimatedContainer(
                  duration: const Duration(milliseconds: 400),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: agent.color.withAlpha(
                      isActive
                          ? 60
                          : isComplete
                          ? 50
                          : 30,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: isActive
                        ? [
                            BoxShadow(
                              color: agent.color.withAlpha(80),
                              blurRadius: 12,
                              spreadRadius: 2,
                            ),
                          ]
                        : null,
                  ),
                  child: Icon(
                    isComplete ? Icons.check : agent.icon,
                    color: agent.color,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 14),

                // Name and status
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        agent.name,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: isActive
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                      const SizedBox(height: 4),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: Text(
                          isComplete
                              ? _getAgentResult(agent, wellnessState.plan)
                              : isActive
                              ? agent.reasoningText
                              : 'Waiting...',
                          key: ValueKey(
                            '${agent.name}_${isComplete}_$isActive',
                          ),
                          style: TextStyle(
                            color: isComplete
                                ? Colors.green.withAlpha(200)
                                : isActive
                                ? agent.color.withAlpha(180)
                                : Colors.white.withAlpha(80),
                            fontSize: 12,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),

                // Status indicator
                if (isComplete)
                  Icon(Icons.check_circle, color: Colors.green, size: 20)
                else if (isActive)
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation(agent.color),
                    ),
                  ),
              ],
            ),

            // Progress bar (active agent only)
            if (isActive)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: AnimatedBuilder(
                  animation: _progressController,
                  builder: (context, child) {
                    return ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: _progressController.value,
                        backgroundColor: Colors.white.withAlpha(20),
                        valueColor: AlwaysStoppedAnimation(agent.color),
                        minHeight: 3,
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _getAgentResult(_AgentData agent, plan) {
    if (plan == null) return '✓ Complete';

    switch (agent.name) {
      case 'Fitness Agent':
        return '→ ${plan.fitness?.type ?? 'Light walk + mobility'}';
      case 'Nutrition Agent':
        return '→ ${plan.nutrition?.dailyCalories ?? 2000} cal/day';
      case 'Sleep Agent':
        return '→ Bedtime: ${plan.sleep?.bedtime ?? "22:30"}';
      case 'Mental Agent':
        return '→ ${plan.mental?.focus ?? 'Mindfulness & recovery'}';
      case 'Coordinator':
        return '→ All agents aligned, plan finalized';
      default:
        return '✓ Complete';
    }
  }

  Widget _buildAnimatedOrb() {
    return AnimatedOpacity(
      opacity: _allComplete ? 0.0 : 1.0,
      duration: const Duration(milliseconds: 400),
      child: SizedBox(
        width: 120,
        height: 120,
        child: AnimatedBuilder(
          animation: Listenable.merge([_orbController, _pulseController]),
          builder: (context, child) {
            return CustomPaint(
              painter: _OrbPainter(
                rotation: _orbController.value * 2 * math.pi,
                pulse: _pulseController.value,
                color: _agents[_currentAgentIndex >= 0 ? _currentAgentIndex : 0]
                    .color,
              ),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        _agents[_currentAgentIndex >= 0
                                ? _currentAgentIndex
                                : 0]
                            .color
                            .withAlpha(200),
                        _agents[_currentAgentIndex >= 0
                                ? _currentAgentIndex
                                : 0]
                            .color
                            .withAlpha(50),
                      ],
                    ),
                  ),
                  child: const Icon(
                    Icons.auto_awesome,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPlanPreview(WellnessState wellnessState) {
    final plan = wellnessState.plan!;

    return AnimatedOpacity(
      opacity: _currentPhase >= 4 ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 500),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 20),
              const SizedBox(width: 8),
              const Text(
                'Your Personalized Plan',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          AppGlassCard(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  if (plan.fitness != null)
                    _buildPlanRow(
                      Icons.fitness_center,
                      Colors.blue,
                      'Fitness',
                      plan.fitness!.type ?? 'Recovery workout',
                    ),
                  if (plan.nutrition != null)
                    _buildPlanRow(
                      Icons.restaurant_menu,
                      Colors.green,
                      'Nutrition',
                      '${plan.nutrition!.dailyCalories ?? 2000} cal/day',
                    ),
                  if (plan.sleep != null)
                    _buildPlanRow(
                      Icons.bedtime,
                      Colors.indigo,
                      'Sleep',
                      'Bedtime: ${plan.sleep!.bedtime ?? "22:30"}',
                    ),
                  if (plan.mental != null)
                    _buildPlanRow(
                      Icons.psychology,
                      Colors.purple,
                      'Mental',
                      plan.mental!.focus ?? 'Light mindfulness',
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlanRow(IconData icon, Color color, String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withAlpha(40),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.white.withAlpha(150),
                    fontSize: 11,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(WellnessState wellnessState) {
    return AnimatedOpacity(
      opacity: _currentPhase >= 5 ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 400),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF1E1B4B).withAlpha(0),
              const Color(0xFF1E1B4B),
            ],
          ),
        ),
        child: Column(
          children: [
            // Confirmation message
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.green.withAlpha(20),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.green.withAlpha(50)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.check_circle_outline,
                    color: Colors.green,
                    size: 16,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Plan updated based on today\'s recovery needs',
                    style: TextStyle(
                      color: Colors.green.shade300,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Action buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildActionButton(
                  icon: Icons.check,
                  label: 'Accept',
                  color: Colors.green,
                  isPrimary: true,
                  onTap: () => _onAccept(wellnessState),
                ),
                const SizedBox(width: 12),
                _buildActionButton(
                  icon: Icons.edit,
                  label: 'Modify',
                  color: Colors.orange,
                  onTap: () {},
                ),
                const SizedBox(width: 12),
                _buildActionButton(
                  icon: Icons.close,
                  label: 'Skip',
                  color: Colors.red,
                  onTap: () {
                    _submitFeedback(false);
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const DashboardScreen(),
                      ),
                      (route) => false,
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
    bool isPrimary = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(
          horizontal: isPrimary ? 24 : 16,
          vertical: 12,
        ),
        decoration: BoxDecoration(
          color: isPrimary ? color : color.withAlpha(20),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withAlpha(isPrimary ? 0 : 80)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isPrimary ? Colors.white : color, size: 18),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isPrimary ? Colors.white : color,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitFeedback(bool accepted) async {
    try {
      final user = supabase.auth.currentUser;
      if (user == null) return;

      final url = Uri.parse('${AppConstants.baseUrl}/feedback');
      debugPrint('Sending feedback to: $url');

      // Fire and forget (don't await response to speed up UX)
      http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': user.id,
          'accepted': accepted,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      );
    } catch (e) {
      debugPrint('Error sending feedback: $e');
    }
  }

  void _onAccept(WellnessState wellnessState) {
    if (wellnessState.plan != null) {
      _submitFeedback(true);
      // Clear entire navigation stack and go to Dashboard
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const DashboardScreen()),
        (route) => false, // Remove all previous routes
      );
    }
  }
}

class _AgentData {
  final String name;
  final IconData icon;
  final Color color;
  final String reasoningText;
  final bool isCoordinator;
  bool isComplete;

  _AgentData({
    required this.name,
    required this.icon,
    required this.color,
    required this.reasoningText,
    this.isCoordinator = false,
    this.isComplete = false,
  });
}

class _OrbPainter extends CustomPainter {
  final double rotation;
  final double pulse;
  final Color color;

  _OrbPainter({
    required this.rotation,
    required this.pulse,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 10;

    // Draw outer rings
    final ringPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    for (int i = 0; i < 3; i++) {
      final ringRadius = radius - (i * 12) + (pulse * 4);
      ringPaint.color = color.withAlpha(40 - (i * 10));
      canvas.drawCircle(center, ringRadius, ringPaint);
    }

    // Draw orbiting dots
    final dotPaint = Paint()..style = PaintingStyle.fill;
    for (int i = 0; i < 4; i++) {
      final angle = rotation + (i * math.pi / 2);
      final x = center.dx + radius * 0.7 * math.cos(angle);
      final y = center.dy + radius * 0.7 * math.sin(angle);
      dotPaint.color = color.withAlpha(150);
      canvas.drawCircle(Offset(x, y), 3, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _OrbPainter oldDelegate) {
    return oldDelegate.rotation != rotation || oldDelegate.pulse != pulse;
  }
}
