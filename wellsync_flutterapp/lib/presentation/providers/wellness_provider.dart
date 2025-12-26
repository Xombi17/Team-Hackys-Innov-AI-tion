import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../data/wellness_repository.dart';
import '../../domain/wellness_plan.dart';
import '../../main.dart';

// The repository provider
final wellnessRepositoryProvider = Provider<WellnessRepository>((ref) {
  return WellnessRepository();
});

// Current user provider
final currentUserProvider = Provider<User?>((ref) {
  return supabase.auth.currentUser;
});

final currentUserIdProvider = Provider<String>((ref) {
  return supabase.auth.currentUser?.id ?? 'demo_user';
});

// State for the wellness plan
class WellnessState {
  final WellnessPlan? plan;
  final String? stateId;
  final bool isLoading;
  final String? error;
  final List<String> completedTasks;

  WellnessState({
    this.plan,
    this.stateId,
    this.isLoading = false,
    this.error,
    this.completedTasks = const [],
  });

  WellnessState copyWith({
    WellnessPlan? plan,
    String? stateId,
    bool? isLoading,
    String? error,
    List<String>? completedTasks,
  }) {
    return WellnessState(
      plan: plan ?? this.plan,
      stateId: stateId ?? this.stateId,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      completedTasks: completedTasks ?? this.completedTasks,
    );
  }
}

// The notifier that manages state
class WellnessNotifier extends StateNotifier<WellnessState> {
  final WellnessRepository _repository;
  final String userId;

  WellnessNotifier(this._repository, this.userId)
    : super(
        WellnessState(
          // Start with no plan so user sees Daily Check-In button
          plan: null,
        ),
      ) {
    _loadCachedPlan();
    _loadCachedCompletedTasks();
  }

  Future<void> _loadCachedPlan() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? cachedJson = prefs.getString('wellness_plan_$userId');

      if (cachedJson != null) {
        final Map<String, dynamic> jsonMap = jsonDecode(cachedJson);
        final cachedPlan = WellnessPlan.fromJson(jsonMap);
        state = state.copyWith(plan: cachedPlan);
      }

      // Always try to fetch latest from backend to ensure data is fresh,
      // or if cache was empty.
      final latest = await _repository.getLatestPlan(userId);
      if (latest != null) {
        // If backend has a plan, update state (backend is truth)
        state = state.copyWith(plan: latest);
        _savePlan(latest);
      }
    } catch (e) {
      debugPrint('Error loading cached plan: $e');
    }
  }

  Future<void> _savePlan(WellnessPlan plan) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String jsonString = jsonEncode(plan.toJson());
      await prefs.setString('wellness_plan_$userId', jsonString);
    } catch (e) {
      debugPrint('Error saving plan to cache: $e');
    }
  }

  Future<void> _loadCachedCompletedTasks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<String>? cachedTasks = prefs.getStringList(
        'completed_tasks_$userId',
      );
      if (cachedTasks != null) {
        state = state.copyWith(completedTasks: cachedTasks);
      }
    } catch (e) {
      debugPrint('Error loading cached tasks: $e');
    }
  }

  Future<void> _saveCompletedTasks(List<String> tasks) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('completed_tasks_$userId', tasks);
    } catch (e) {
      debugPrint('Error saving tasks to cache: $e');
    }
  }

  /// Generate a new wellness plan
  Future<void> generatePlan(Map<String, dynamic> userProfile) async {
    state = state.copyWith(isLoading: true, error: null);

    // Minimum Thinking Time for UX (to show animation)
    final minTime = Future.delayed(const Duration(seconds: 4));

    try {
      final plan = await _repository.generatePlan(
        userId: userId,
        userProfile: userProfile,
      );

      await minTime; // Wait for at least 4 seconds
      state = state.copyWith(plan: plan, isLoading: false, error: null);
      _savePlan(plan);
    } catch (e) {
      await minTime;
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  /// Load existing plan by state ID
  Future<void> loadPlan(String stateId) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final plan = await _repository.getPlanByStateId(stateId);
      if (plan != null) {
        state = state.copyWith(plan: plan, stateId: stateId, isLoading: false);
        _savePlan(plan);
      } else {
        state = state.copyWith(isLoading: false, error: 'Plan not found');
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  /// Load completed tasks
  Future<void> loadCompletedTasks() async {
    try {
      // 1. First ensure we have local cache loaded (should be done in init, but safe to check)
      // await _loadCachedCompletedTasks();
      // (Skipping explicitly calling it here as init does it, and we want to allow this method to refresh from backend)

      // 2. Fetch from backend
      final tasks = await _repository.getCompletedTasks(userId);

      // 3. Update state AND cache
      state = state.copyWith(completedTasks: tasks);
      _saveCompletedTasks(tasks);
    } catch (e) {
      debugPrint('Failed to load completed tasks from backend: $e');
      // Fallback is simply keeping/using the local cache loaded at init
    }
  }

  /// Toggle a task completion
  Future<void> toggleTask(String taskId) async {
    final current = List<String>.from(state.completedTasks);
    if (current.contains(taskId)) {
      current.remove(taskId);
    } else {
      current.add(taskId);
    }
    state = state.copyWith(completedTasks: current);

    // 1. Instantly save to local cache
    _saveCompletedTasks(current);

    // 2. Sync to backend
    try {
      await _repository.syncCompletedTasks(userId, current);
    } catch (e) {
      debugPrint("Error syncing task to backend: $e");
    }
  }

  /// Refresh the plan
  Future<void> refresh() async {
    if (state.stateId != null) {
      await loadPlan(state.stateId!);
    }
  }
}

// The family provider for WellnessNotifier (keyed by userId)
final wellnessProvider =
    StateNotifierProvider.family<WellnessNotifier, WellnessState, String>((
      ref,
      userId,
    ) {
      return WellnessNotifier(ref.read(wellnessRepositoryProvider), userId);
    });

final currentWellnessProvider = Provider<WellnessNotifier>((ref) {
  final userId = ref.watch(currentUserIdProvider);
  return ref.watch(wellnessProvider(userId).notifier);
});

final currentWellnessStateProvider = Provider<WellnessState>((ref) {
  final userId = ref.watch(currentUserIdProvider);
  return ref.watch(wellnessProvider(userId));
});
