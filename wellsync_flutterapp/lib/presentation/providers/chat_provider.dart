import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/chat_repository.dart';

// Message model
class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

// Chat repository provider
final chatRepositoryProvider = Provider<ChatRepository>(
  (ref) => ChatRepository(),
);

// Chat state notifier
class ChatNotifier extends StateNotifier<List<ChatMessage>> {
  final ChatRepository _repository;
  final String userId;

  ChatNotifier(this._repository, this.userId)
    : super([
        ChatMessage(
          text:
              "Hello! I'm your WellSync AI Wellness Coach. How can I help you stay on track with your wellness goals today?",
          isUser: false,
          timestamp: DateTime.now(),
        ),
      ]);

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // Add user message
    final userMessage = ChatMessage(
      text: text,
      isUser: true,
      timestamp: DateTime.now(),
    );
    state = [...state, userMessage];

    // Get AI response
    try {
      final response = await _repository.sendMessage(
        userId: userId,
        message: text,
      );

      final aiMessage = ChatMessage(
        text: response,
        isUser: false,
        timestamp: DateTime.now(),
      );
      state = [...state, aiMessage];
    } catch (e) {
      final errorMessage = ChatMessage(
        text: "I'm having trouble connecting. Please try again.",
        isUser: false,
        timestamp: DateTime.now(),
      );
      state = [...state, errorMessage];
    }
  }

  void clearChat() {
    state = [
      ChatMessage(
        text: "Chat cleared. How can I help you today?",
        isUser: false,
        timestamp: DateTime.now(),
      ),
    ];
  }
}

// Provider
final chatProvider =
    StateNotifierProvider.family<ChatNotifier, List<ChatMessage>, String>((
      ref,
      userId,
    ) {
      return ChatNotifier(ref.read(chatRepositoryProvider), userId);
    });
