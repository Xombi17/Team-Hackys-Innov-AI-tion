import 'package:dio/dio.dart';
import 'api_client.dart';

class ChatRepository {
  final Dio _dio = apiClient;

  /// Send a message to the AI Wellness Coach
  Future<String> sendMessage({
    required String userId,
    required String message,
  }) async {
    try {
      final response = await _dio.post(
        '/chat',
        data: {
          'user_id': userId,
          'message': message,
          'context': {}, // Initial context, can be expanded later
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        return data['response']?.toString() ??
            data['message']?.toString() ??
            'I received your message but couldn\'t process it.';
      }
      return 'Sorry, I couldn\'t connect to the server.';
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        // Chat endpoint might not exist, provide a fallback
        return 'The chat service is currently unavailable. Please try again later.';
      }
      return 'Connection error: ${e.message}';
    }
  }
}
