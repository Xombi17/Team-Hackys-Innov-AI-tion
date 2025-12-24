
import os
import sys

try:
    from huggingface_hub import HfApi, login
except ImportError:
    print("Please run: pip install huggingface_hub")
    sys.exit(1)

def deploy():
    print("🚀 WellSync AI - Hugging Face Deployer")
    print("--------------------------------------")
    print("This script will upload your code to a Hugging Face Space.")
    print("Ensure you have created a 'Docker' space at https://huggingface.co/new-space first.\n")

    # 1. Login
    token = os.getenv("HF_TOKEN")
    if not token:
        print("📝 Step 1: Authentication")
        print("   Get your Write Token here: https://huggingface.co/settings/tokens")
        token = input("   Enter your HF Write Token: ").strip()
    
    if not token:
        print("❌ Token is required.")
        return
        
    try:
        login(token=token)
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return

    # 2. Get Repo
    print("\n📝 Step 2: Destination")
    repo_id = input("   Enter your Space Repo ID (e.g., 'username/wellsync-api'): ").strip()
    
    if not repo_id:
        print("❌ Repo ID is required.")
        return

    # 3. Upload
    print(f"\n📦 Step 3: Uploading to {repo_id}...")
    print("   This may take a minute depending on your internet speed.")
    
    api = HfApi()
    try:
        api.upload_folder(
            folder_path=".",
            repo_id=repo_id,
            repo_type="space",
            # Exclude heavy/sensitive files
            ignore_patterns=[
                ".git", ".gitignore", "venv", "env", "__pycache__", 
                "*.pyc", ".env", ".env.example", "web", "node_modules",
                "deploy_to_hf.py"
            ],
            commit_message="Deploy from WellSync Agent 🚀"
        )
        print("\n✅ Upload Complete!")
        print(f"👉 Your API is building here: https://huggingface.co/spaces/{repo_id}")
        
        print("\n⚠️  CRITICAL FINAL STEP:")
        print("   Go to your Space 'Settings' -> 'Variables and Secrets' and add:")
        print("   1. Secret: GEMINI_API_KEY  (Paste your actual key)")
        print("   2. Variable: LLM_MODEL     (Value: gemini/gemini-3-flash-preview)")
        
    except Exception as e:
        print(f"\n❌ Upload Error: {e}")
        print("   Make sure the Repo ID is correct and you have Write access.")

if __name__ == "__main__":
    deploy()
