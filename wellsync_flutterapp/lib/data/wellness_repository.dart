import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../main.dart';
import 'api_client.dart';
import '../domain/wellness_plan.dart';

class WellnessRepository {
  final Dio _dio = apiClient;

  /// Get the latest wellness plan from Supabase
  Future<WellnessPlan?> getLatestPlan(String userId) async {
    try {
      final response = await supabase
          .from('wellness_plans')
          .select('plan_data')
          .eq('user_id', userId)
          .order('timestamp', ascending: false)
          .limit(1)
          .maybeSingle();

      if (response != null && response['plan_data'] != null) {
        final planData = response['plan_data'];
        final Map<String, dynamic> jsonMap = (planData is String)
            ? jsonDecode(planData)
            : Map<String, dynamic>.from(planData);
        return WellnessPlan.fromJson(jsonMap);
      }
      return null;
    } catch (e) {
      debugPrint('Error fetching latest plan: $e');
      return null;
    }
  }

  /// Generate a new wellness plan by calling the backend API
  Future<WellnessPlan> generatePlan({
    required String userId,
    required Map<String, dynamic> userProfile,
    Map<String, dynamic>? constraints,
    Map<String, dynamic>? goals,
  }) async {
    try {
      final response = await _dio.post(
        '/wellness-plan',
        data: {
          'user_profile': {'user_id': userId, ...userProfile},
          'constraints': constraints ?? {'time_available': '60 mins'},
          'goals': goals ?? {},
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        if (data['success'] == true && data['plan'] != null) {
          return WellnessPlan.fromJson(data['plan'] as Map<String, dynamic>);
        }
      }
      throw Exception('Failed to generate plan: Invalid response');
    } catch (e) {
      // FALLBACK TO MOCK DATA FOR DEMO/OFFLINE MODE
      debugPrint('API Error: $e. Using Mock Data.');
      return getMockPlan();
    }
  }

  WellnessPlan getMockPlan() {
    return WellnessPlan(
      planId: 'mock_plan_001',
      fitness: FitnessPlan(
        type: 'HIIT Cardio',
        intensity: 'High',
        duration: 45,
        recommendation: 'Focus on keeping your heart rate up.',
        workoutPlan: {
          'warmup': '5 min jogging',
          'main': '30 min HIIT circuit',
          'cooldown': '10 min stretching',
        },
      ),
      nutrition: NutritionPlan(
        dailyCalories: 2200,
        hydration: 'Drink 3L of water today.',
        meals: [
          {
            'name': 'Breakfast',
            'calories': 500,
            'description': 'Oatmeal & Berries',
          },
          {
            'name': 'Lunch',
            'calories': 700,
            'description': 'Grilled Chicken Salad',
          },
          {
            'name': 'Dinner',
            'calories': 600,
            'description': 'Salmon & Veggies',
          },
        ],
      ),
      sleep: SleepPlan(
        targetHours: 8.0,
        bedtime: '10:00 PM',
        wakeTime: '06:00 AM',
        recommendation: 'Avoid screens 1 hour before bed.',
      ),
      mental: MentalPlan(
        focus: 'Stress Reduction',
        recommendation: 'Try 10 minutes of deep breathing.',
        practices: [
          {'name': 'Meditation', 'duration': '10 mins'},
          {'name': 'Gratitude Journal', 'duration': '5 mins'},
        ],
      ),
      reasoning: 'Generated mock plan for offline mode.',
      confidence: 0.95,
    );
  }

  /// Get an existing wellness plan by state_id
  Future<WellnessPlan?> getPlanByStateId(String stateId) async {
    try {
      final response = await _dio.get('/wellness-plan/$stateId');

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        if (data['success'] == true && data['current_plans'] != null) {
          return WellnessPlan.fromJson(
            data['current_plans'] as Map<String, dynamic>,
          );
        }
      }
      return null;
    } on DioException {
      return null;
    }
  }

  /// Get completed tasks for a user
  Future<List<String>> getCompletedTasks(String userId) async {
    try {
      final response = await _dio.get(
        '/plan/progress',
        queryParameters: {'user_id': userId},
      );
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        if (data['success'] == true) {
          return List<String>.from(data['completed_tasks'] ?? []);
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Sync completed tasks
  Future<bool> syncCompletedTasks(
    String userId,
    List<String> completedTasks,
  ) async {
    try {
      final response = await _dio.post(
        '/plan/progress',
        data: {'user_id': userId, 'completed_tasks': completedTasks},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
