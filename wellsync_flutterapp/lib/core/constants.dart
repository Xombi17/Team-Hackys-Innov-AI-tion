import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  // Hugging Face Hosted API (production)
  // Update this to your actual Hugging Face Space URL when deployed
  static const String hostedApiUrl = 'https://xombi17-wellsync-api.hf.space';

  // Determine correct local URL based on platform
  static String get localApiUrl {
    if (kIsWeb) return 'http://localhost:5000';
    if (defaultTargetPlatform == TargetPlatform.android) {
      // Using confirmed local IP for Physical Device
      return 'http://192.168.29.44:5000';
    }
    // iOS simulator / Desktop
    return 'http://localhost:5000';
  }

  // Toggle this for development vs production
  static const bool useHostedApi = true; // Set to true for Hugging Face

  static String get baseUrl => useHostedApi ? hostedApiUrl : localApiUrl;

  static const String appName = 'WellSync AI';

  // Supabase Configuration
  // Supabase Configuration
  static String get supabaseUrl =>
      dotenv.env['SUPABASE_URL'] ?? 'SUPABASE_URL_NOT_FOUND';
  static String get supabaseAnonKey =>
      dotenv.env['SUPABASE_ANON_KEY'] ?? 'SUPABASE_ANON_KEY_NOT_FOUND';
}
