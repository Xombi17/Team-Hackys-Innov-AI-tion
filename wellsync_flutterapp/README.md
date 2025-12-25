# WellSync AI - Flutter Mobile App 📱

![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
![Dart](https://img.shields.io/badge/dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Riverpod](https://img.shields.io/badge/Riverpod-%2342A5F5.svg?style=for-the-badge&logo=flutter&logoColor=white)

**WellSync AI** is a next-generation wellness companion that uses multi-agent AI to orchestrate your daily health decisions. 

This repository contains the **Flutter mobile application** that serves as the user's personal interface to the WellSync Agent Swarm. It features a premium, glassmorphic UI, real-time agent visualizations, and robust offline-first architecture.

🔗 **Live API**: [https://xombi17-wellsync-api.hf.space](https://xombi17-wellsync-api.hf.space)

---

## ✨ Key Features

### 🎨 **Premium UI/UX**
*   **Glassmorphism Design**: Modern, translucent interface elements with blurred backgrounds.
*   **Dynamic Animations**: Custom "Thinking Agent" animations and smooth transitions.
*   **Adaptive Layouts**: Optimized for various screen sizes.

### 🧠 **Intelligent Planning**
*   **Daily Check-In**: Captures mood, energy levels, and recovery status.
*   **Real-Time Generation**: Watch as Fitness, Nutrition, and Mental agents collaborate to build your plan.
*   **Holistic Plans**: 
    *   🏋️ **Fitness**: Custom workouts based on energy levels.
    *   🥗 **Nutrition**: Meal suggestions and macros tailored to your goals.
    *   🧘 **Mental**: Mindfulness practices and journaling prompts.

### 💾 **Robust Architecture**
*   **Offline-First**: Plans and task progress are cached locally (`SharedPreferences`) for instant loading.
*   **Background Sync**: Automatically saves progress to the Supabase cloud when online.
*   **State Management**: Powered by `flutter_riverpod` for reliable and testable state.

### 📊 **Progress Tracking**
*   **Analytics Dashboard**: Visual charts tracking weekly activity and consistency.
*   **History**: Review past days and generated plans.

---

## 🛠️ Tech Stack

*   **Framework**: Flutter 3.10+
*   **Language**: Dart
*   **State Management**: [flutter_riverpod](https://pub.dev/packages/flutter_riverpod)
*   **Backend & Auth**: [supabase_flutter](https://pub.dev/packages/supabase_flutter)
*   **Networking**: [dio](https://pub.dev/packages/dio)
*   **UI Components**: [glass_kit](https://pub.dev/packages/glass_kit) (custom implementation), Google Fonts.
*   **Local Storage**: [shared_preferences](https://pub.dev/packages/shared_preferences)

---

## 🚀 Getting Started

### Prerequisites
*   [Flutter SDK](https://docs.flutter.dev/get-started/install) installed.
*   A connected Android device or Emulator.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Xombi17/wellsync-ai-flutterapp.git
    cd wellsync-ai-flutterapp
    ```

2.  **Install Dependencies**
    ```bash
    flutter pub get
    ```

3.  **Environment Setup**
    *   The app connects to a hosted backend by default for development. 
    *   Verify `lib/core/constants.dart`:
        ```dart
        static const bool useHostedApi = true; // Set to true to use the live agent API
        ```

### Running the App

```bash
flutter run
```

---

## 📂 Project Structure

```
lib/
├── core/                # Constants, Themes, Utilities
├── data/                # Repositories & API Services
│   ├── wellness_repository.dart  # Main data fetcher
│   └── chat_repository.dart      # Chat API integration
├── domain/              # Data Models
│   └── wellness_plan.dart        # Core Plan Model
├── presentation/        # UI Layer
│   ├── dashboard/       # Main Dashboard Screen
│   ├── plans/           # Fitness, Nutrition, Mental Screens
│   ├── onbaording/      # Setup Wizard
│   ├── providers/       # Riverpod State Notifiers
│   └── widgets/         # Reusable Components (GlassCard, etc.)
└── main.dart            # Entry Point
```

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

built with ❤️ by **Team Xombi17** for InnovAI Swarms Hackathon
