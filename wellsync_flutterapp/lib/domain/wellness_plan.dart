// Simple data models without code generation (freezed)
// Manually implemented for reliability

class WellnessPlan {
  final String? planId;
  final FitnessPlan? fitness;
  final NutritionPlan? nutrition;
  final SleepPlan? sleep;
  final MentalPlan? mental;
  final String? reasoning;
  final double? confidence;

  WellnessPlan({
    this.planId,
    this.fitness,
    this.nutrition,
    this.sleep,
    this.mental,
    this.reasoning,
    this.confidence,
  });

  factory WellnessPlan.fromJson(Map<String, dynamic> json) {
    // Handle nested 'unified_plan' structure from backend
    final root = json;
    final unified = json['unified_plan'] as Map<String, dynamic>? ?? json;

    // DEBUG: Print keys to console to find missing agents
    print("DEBUG: Parsing WellnessPlan. Root keys: ${root.keys}");
    print("DEBUG: Unified keys: ${unified.keys}");
    if (unified['mental'] == null &&
        unified['mental_wellness_protocol'] == null) {
      print("DEBUG: MENTAL PLAN MISSING! Check these keys: ${unified.keys}");
    }

    return WellnessPlan(
      planId: root['plan_id']?.toString(),
      fitness: (unified['fitness'] ?? unified['fitness_protocol']) != null
          ? FitnessPlan.fromJson(
              (unified['fitness'] ?? unified['fitness_protocol'])
                  as Map<String, dynamic>,
            )
          : null,
      nutrition: (unified['nutrition'] ?? unified['nutrition_protocol']) != null
          ? NutritionPlan.fromJson(
              (unified['nutrition'] ?? unified['nutrition_protocol'])
                  as Map<String, dynamic>,
            )
          : null,
      sleep: (unified['sleep'] ?? unified['sleep_protocol']) != null
          ? SleepPlan.fromJson(
              (unified['sleep'] ?? unified['sleep_protocol'])
                  as Map<String, dynamic>,
            )
          : null,
      mental:
          (unified['mental'] ??
                  unified['mental_wellness'] ??
                  unified['mental_wellness_protocol']) !=
              null
          ? MentalPlan.fromJson(
              (unified['mental'] ??
                      unified['mental_wellness'] ??
                      unified['mental_wellness_protocol'])
                  as Map<String, dynamic>,
            )
          : null,
      reasoning: root['reasoning']?.toString(),
      confidence: (root['confidence'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'plan_id': planId,
      'fitness': fitness?.toJson(),
      'nutrition': nutrition?.toJson(),
      'sleep': sleep?.toJson(),
      'mental': mental?.toJson(),
      'reasoning': reasoning,
      'confidence': confidence,
    };
  }
}

class FitnessPlan {
  final String? type;
  final String? intensity;
  final int? duration;
  final Map<String, dynamic>? workoutPlan;
  final String? recommendation;

  FitnessPlan({
    this.type,
    this.intensity,
    this.duration,
    this.workoutPlan,
    this.recommendation,
  });

  factory FitnessPlan.fromJson(Map<String, dynamic> json) {
    // Extract data from Agent Output Format
    final workoutPlan = json['workout_plan'] as Map<String, dynamic>?;
    final weekly = workoutPlan?['weekly_schedule'] as List<dynamic>?;

    // Attempt to find a workout type from the first scheduled session
    String? type = json['type']?.toString();
    if (type == null && weekly != null && weekly.isNotEmpty) {
      type = weekly[0]['focus']?.toString() ?? weekly[0]['type']?.toString();
    }
    type ??= "Personalized Workout";

    // Extract recommendation from reasoning if not explicit
    String? recommendation = json['recommendation']?.toString();
    if (recommendation == null) {
      final reasoning = json['reasoning']?.toString();
      if (reasoning != null) {
        recommendation = reasoning.length > 50
            ? '${reasoning.substring(0, 50)}...'
            : reasoning;
      }
    }

    // Duration estimate from first session
    int? duration = json['duration'] as int?;
    if (duration == null && weekly != null && weekly.isNotEmpty) {
      duration = weekly[0]['duration_minutes'] as int?;
    }
    duration ??= 45; // Default

    return FitnessPlan(
      type: type,
      intensity: json['intensity']?.toString() ?? 'Moderate',
      duration: duration,
      workoutPlan: workoutPlan,
      recommendation: recommendation,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'intensity': intensity,
      'duration': duration,
      'workout_plan': workoutPlan,
      'recommendation': recommendation,
    };
  }
}

class NutritionPlan {
  final int? dailyCalories;
  final List<dynamic>? meals;
  final String? hydration;

  NutritionPlan({this.dailyCalories, this.meals, this.hydration});

  factory NutritionPlan.fromJson(Map<String, dynamic> json) {
    // Handle agent structure
    final plan = json['nutritional_plan'] as Map<String, dynamic>? ?? json;

    return NutritionPlan(
      dailyCalories: plan['daily_calories'] as int? ?? json['calories'] as int?,
      meals:
          plan['meal_plan'] as List<dynamic>? ??
          plan['meals'] as List<dynamic>?,
      hydration: plan['hydration']?.toString() ?? json['hydration']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'daily_calories': dailyCalories,
      'meal_plan': meals,
      'hydration': hydration,
    };
  }
}

class SleepPlan {
  final double? targetHours;
  final String? bedtime;
  final String? wakeTime;
  final String? recommendation;

  SleepPlan({
    this.targetHours,
    this.bedtime,
    this.wakeTime,
    this.recommendation,
  });

  factory SleepPlan.fromJson(Map<String, dynamic> json) {
    // Handle agent structure
    final protocol = json['sleep_protocol'] as Map<String, dynamic>? ?? json;

    return SleepPlan(
      targetHours:
          (protocol['target_hours'] as num?)?.toDouble() ??
          (protocol['hours'] as num?)?.toDouble() ??
          (protocol['sleep_duration_hours'] as num?)?.toDouble(),
      bedtime: protocol['bedtime']?.toString(),
      wakeTime: protocol['wake_time']?.toString(),
      recommendation:
          protocol['recommendation']?.toString() ??
          (json['reasoning'] != null
              ? '${json['reasoning'].toString().substring(0, 40)}...'
              : null),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'target_hours': targetHours,
      'bedtime': bedtime,
      'wake_time': wakeTime,
      'recommendation': recommendation,
    };
  }
}

class MentalPlan {
  final List<dynamic>? practices;
  final String? focus;
  final String? recommendation;

  MentalPlan({this.practices, this.focus, this.recommendation});

  factory MentalPlan.fromJson(Map<String, dynamic> json) {
    // Handle agent structure
    final protocol =
        json['mental_wellness_protocol'] as Map<String, dynamic>? ?? json;

    return MentalPlan(
      practices:
          protocol['daily_practices'] as List<dynamic>? ??
          protocol['practices'] as List<dynamic>?,
      focus: protocol['focus']?.toString() ?? "Mindfulness",
      recommendation:
          protocol['recommendation']?.toString() ??
          (json['reasoning'] != null
              ? '${json['reasoning'].toString().substring(0, 40)}...'
              : null),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'daily_practices': practices,
      'focus': focus,
      'recommendation': recommendation,
    };
  }
}
