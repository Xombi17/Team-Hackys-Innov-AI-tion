import 'package:flutter/material.dart';
import '../main.dart';
import 'widgets/app_glass_card.dart';
import 'auth/login_screen.dart';
import 'history_screen.dart';
import 'edit_profile_screen.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _userProfile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      final user = supabase.auth.currentUser;
      if (user != null) {
        // Try to get profile from database
        final response = await supabase
            .from('user_profiles')
            .select()
            .eq('id', user.id)
            .maybeSingle();

        setState(() {
          _userProfile =
              response ??
              {
                'name': user.userMetadata?['name'] ?? 'User',
                'email': user.email,
              };
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _userProfile = {
          'name': supabase.auth.currentUser?.userMetadata?['name'] ?? 'User',
          'email': supabase.auth.currentUser?.email ?? '',
        };
        _isLoading = false;
      });
    }
  }

  Future<void> _signOut() async {
    await supabase.auth.signOut();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      extendBodyBehindAppBar: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
          ),
        ),
        child: SafeArea(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),

                      // Avatar
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [
                              Theme.of(context).primaryColor,
                              Theme.of(context).colorScheme.secondary,
                            ],
                          ),
                        ),
                        child: CircleAvatar(
                          radius: 50,
                          backgroundColor: const Color(0xFF1E1B4B),
                          child: Text(
                            (_userProfile?['name'] ?? 'U')[0].toUpperCase(),
                            style: const TextStyle(
                              fontSize: 40,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Name
                      Text(
                        _userProfile?['name'] ?? 'User',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _userProfile?['email'] ?? '',
                        style: TextStyle(
                          color: Colors.white.withAlpha(150),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Stats Row
                      if (_userProfile != null)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildStatItem(
                              'Height',
                              '${_userProfile!['height'] ?? '-'} cm',
                            ),
                            _buildStatItem(
                              'Weight',
                              '${_userProfile!['weight'] ?? '-'} kg',
                            ),
                            _buildStatItem(
                              'Diet',
                              '${_userProfile!['diet_type'] ?? '-'}',
                            ),
                          ],
                        ),

                      const SizedBox(height: 32),

                      // Profile Options
                      AppGlassCard(
                        child: Column(
                          children: [
                            _buildProfileOption(
                              icon: Icons.person_outline,
                              title: 'Edit Profile',
                              onTap: () {
                                if (_userProfile != null) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => EditProfileScreen(
                                        currentProfile: _userProfile!,
                                        onSave: _loadUserProfile,
                                      ),
                                    ),
                                  );
                                }
                              },
                            ),
                            const Divider(color: Colors.white12),
                            _buildProfileOption(
                              icon: Icons.settings_outlined,
                              title: 'Settings',
                              onTap: () {
                                if (_userProfile != null) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => SettingsScreen(
                                        currentProfile: _userProfile!,
                                        onSave: _loadUserProfile,
                                      ),
                                    ),
                                  );
                                }
                              },
                            ),
                            const Divider(color: Colors.white12),
                            _buildProfileOption(
                              icon: Icons.history,
                              title: 'Wellness History',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const HistoryScreen(),
                                ),
                              ),
                            ),
                            const Divider(color: Colors.white12),
                            _buildProfileOption(
                              icon: Icons.help_outline,
                              title: 'Help & Support',
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Coming soon!')),
                                );
                              },
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Logout Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: OutlinedButton.icon(
                          onPressed: _signOut,
                          icon: const Icon(Icons.logout, color: Colors.red),
                          label: const Text(
                            'Sign Out',
                            style: TextStyle(color: Colors.red),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.red),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 40),

                      // App Version
                      Text(
                        'WellSync AI v1.0.0',
                        style: TextStyle(
                          color: Colors.white.withAlpha(100),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.white70),
      title: Text(title, style: const TextStyle(color: Colors.white)),
      trailing: const Icon(Icons.chevron_right, color: Colors.white54),
      onTap: onTap,
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(color: Colors.white.withAlpha(100), fontSize: 12),
        ),
      ],
    );
  }
}
