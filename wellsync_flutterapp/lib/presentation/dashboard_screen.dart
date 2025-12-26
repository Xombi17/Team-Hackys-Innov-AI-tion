import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../main.dart';
import '../domain/wellness_plan.dart';
import 'providers/wellness_provider.dart';
import 'widgets/app_glass_card.dart';
import 'widgets/domain_list_tile.dart';
import 'widgets/status_pill.dart';
import 'daily_checkin_screen.dart';
import 'chat_screen.dart';
import 'profile_screen.dart';
import 'history_screen.dart';
import 'plans/fitness_plan_screen.dart';
import 'plans/nutrition_plan_screen.dart';
import 'plans/sleep_plan_screen.dart';
import 'plans/mental_plan_screen.dart';
import 'analytics_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _currentIndex = 0;
  String? _userName;

  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  Future<void> _loadUserName() async {
    final user = supabase.auth.currentUser;
    if (user != null) {
      setState(() {
        _userName =
            user.userMetadata?['name'] ??
            user.email?.split('@').first ??
            'User';
      });
    }
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildOverviewScreen(),
          _buildFitnessTab(),
          _buildNutritionTab(),
          _buildSleepTab(),
          _buildMentalTab(),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ChatScreen()),
              ),
              backgroundColor: Theme.of(context).primaryColor,
              child: const Icon(Icons.chat_bubble, color: Colors.white),
            )
          : null,
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        border: Border(top: BorderSide(color: Colors.white.withAlpha(10))),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, null, 'Overview', isLogo: true),
              _buildNavItem(1, Icons.fitness_center, 'Fitness'),
              _buildNavItem(2, Icons.restaurant_menu, 'Nutrition'),
              _buildNavItem(3, Icons.bedtime, 'Sleep'),
              _buildNavItem(4, Icons.psychology, 'Mental'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    int index,
    IconData? icon,
    String label, {
    bool isLogo = false,
  }) {
    final isSelected = _currentIndex == index;
    final color = isSelected ? Theme.of(context).primaryColor : Colors.white54;

    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isLogo)
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected ? color.withAlpha(40) : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'W',
                style: TextStyle(
                  color: color,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )
          else
            Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewScreen() {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    final now = DateTime.now();
    final dateStr = DateFormat('EEEE, MMMM d').format(now);

    return Container(
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
              // Header
              Row(
                children: [
                  // Logo
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor.withAlpha(40),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'W',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${_getGreeting()}, ${_userName ?? 'User'}.',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          dateStr,
                          style: TextStyle(
                            color: Colors.white.withAlpha(100),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Analytics
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AnalyticsScreen(),
                      ),
                    ),
                    child: Container(
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(10),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        Icons.bar_chart,
                        color: Colors.white.withAlpha(150),
                        size: 20,
                      ),
                    ),
                  ),
                  // History
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const HistoryScreen()),
                    ),
                    child: Container(
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(10),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        Icons.history,
                        color: Colors.white.withAlpha(150),
                        size: 20,
                      ),
                    ),
                  ),
                  // Profile
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ProfileScreen()),
                    ),
                    child: CircleAvatar(
                      radius: 18,
                      backgroundColor: Colors.white.withAlpha(20),
                      child: Icon(
                        Icons.person,
                        color: Colors.white.withAlpha(150),
                        size: 18,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Status Pills
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    StatusPill(
                      icon: Icons.check,
                      label: 'Overview',
                      isActive: true,
                      activeColor: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: 8),
                    const StatusPill(label: '24 Iteration'),
                    const SizedBox(width: 8),
                    const StatusPill(label: '+ Wellness scoring'),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Today's Plan
              const Text(
                "Today's Plan",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),

              if (wellnessState.isLoading)
                _buildLoadingCard()
              else if (wellnessState.plan != null)
                _buildPlanCard(wellnessState.plan!)
              else
                _buildEmptyCard(),

              const SizedBox(height: 24),

              // Why this plan
              if (wellnessState.plan != null) ...[
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
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Icon(
                              Icons.keyboard_arrow_down,
                              color: Colors.white.withAlpha(150),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        _buildBulletPoint('You slept less than your baseline.'),
                        _buildBulletPoint(
                          'Energy levels were reported as medium-low.',
                        ),
                        _buildBulletPoint(
                          'System prioritized recovery over performance.',
                        ),
                      ],
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlanCard(WellnessPlan plan) {
    return AppGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.amber.withAlpha(40),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.wb_sunny,
                    color: Colors.amber,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Recovery-focused day',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Adjusted due to low sleep & medium energy.',
                        style: TextStyle(color: Colors.white54, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            const Divider(color: Colors.white12),
            const SizedBox(height: 12),

            // Domain items
            if (plan.fitness != null)
              DomainListTile(
                icon: Icons.fitness_center,
                iconColor: Colors.blue,
                title: 'Fitness:',
                subtitle: plan.fitness!.type ?? 'Light walk + mobility',
                onTap: () => setState(() => _currentIndex = 1),
              ),
            if (plan.nutrition != null)
              DomainListTile(
                icon: Icons.restaurant_menu,
                iconColor: Colors.green,
                title: 'Nutrition:',
                subtitle:
                    plan.nutrition!.hydration ??
                    'Dal, rice, curd with no deficit',
                onTap: () => setState(() => _currentIndex = 2),
              ),
            if (plan.sleep != null)
              DomainListTile(
                icon: Icons.bedtime,
                iconColor: Colors.indigo,
                title: 'Sleep:',
                subtitle: 'Early bedtime (${plan.sleep!.bedtime ?? "22:30"})',
                onTap: () => setState(() => _currentIndex = 3),
              ),
            if (plan.mental != null)
              DomainListTile(
                icon: Icons.psychology,
                iconColor: Colors.purple,
                title: 'Mental:',
                subtitle:
                    plan.mental!.recommendation ??
                    'Low-pressure day, short mindfulness',
                onTap: () => setState(() => _currentIndex = 4),
              ),

            const SizedBox(height: 12),
            const Divider(color: Colors.white12),
            const SizedBox(height: 8),

            Text(
              'Estimated total effort: Low',
              style: TextStyle(
                color: Colors.white.withAlpha(100),
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const DailyCheckinScreen()),
                ),
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Regenerate Plan'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Theme.of(context).primaryColor,
                  side: BorderSide(
                    color: Theme.of(context).primaryColor.withAlpha(100),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingCard() {
    return AppGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Center(
          child: Column(
            children: [
              CircularProgressIndicator(color: Theme.of(context).primaryColor),
              const SizedBox(height: 16),
              Text(
                'Agents are processing...',
                style: TextStyle(color: Colors.white.withAlpha(150)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyCard() {
    return AppGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Icon(
              Icons.auto_awesome,
              color: Colors.amber.withAlpha(200),
              size: 48,
            ),
            const SizedBox(height: 16),
            const Text(
              'Start your daily check-in',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "Tell us how you're doing and we'll create your personalized plan.",
              style: TextStyle(
                color: Colors.white.withAlpha(150),
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const DailyCheckinScreen()),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 28,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Daily Check-In'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
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
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Tab screens
  Widget _buildFitnessTab() {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    if (wellnessState.plan?.fitness != null) {
      return FitnessPlanScreen(plan: wellnessState.plan!.fitness!);
    }
    return _buildEmptyTabContent('Fitness', Icons.fitness_center, Colors.blue);
  }

  Widget _buildNutritionTab() {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    if (wellnessState.plan?.nutrition != null) {
      return NutritionPlanScreen(plan: wellnessState.plan!.nutrition!);
    }
    return _buildEmptyTabContent(
      'Nutrition',
      Icons.restaurant_menu,
      Colors.green,
    );
  }

  Widget _buildSleepTab() {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    if (wellnessState.plan?.sleep != null) {
      return SleepPlanScreen(plan: wellnessState.plan!.sleep!);
    }
    return _buildEmptyTabContent('Sleep', Icons.bedtime, Colors.indigo);
  }

  Widget _buildMentalTab() {
    final wellnessState = ref.watch(currentWellnessStateProvider);
    if (wellnessState.plan?.mental != null) {
      return MentalPlanScreen(plan: wellnessState.plan!.mental!);
    }
    return _buildEmptyTabContent(
      'Mental Wellness',
      Icons.psychology,
      Colors.purple,
    );
  }

  Widget _buildEmptyTabContent(String title, IconData icon, Color color) {
    return Container(
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
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color.withAlpha(100), size: 64),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Complete your daily check-in to see your plan',
                style: TextStyle(
                  color: Colors.white.withAlpha(100),
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const DailyCheckinScreen()),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: color,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Start Check-In'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
