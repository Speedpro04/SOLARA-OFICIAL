import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent

load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(BASE_DIR / ".env", override=True)

class Settings:
    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Database URL (Supabase connection string)
    DATABASE_URL = os.getenv("DATABASE_URL", "")

    # Redis (Supabase ou Redis Cloud)
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # JWT (Supabase Auth usa JWT próprio)
    JWT_SECRET = os.getenv("JWT_SECRET", "")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Evolution API
    EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
    EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "")

    # Celery
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_URL = os.getenv("CELERY_RESULT_URL", "redis://localhost:6379/2")

    # SSL/HTTPS
    SSL_CERTFILE = os.getenv("SSL_CERTFILE", "")
    SSL_KEYFILE = os.getenv("SSL_KEYFILE", "")
    USE_SSL = os.getenv("USE_SSL", "false").lower() == "true"

    # Frontend URL (for checkout redirects)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_PUBLIC_URL = os.getenv("BACKEND_PUBLIC_URL", "")
    EVOLUTION_WEBHOOK_SECRET = os.getenv("EVOLUTION_WEBHOOK_SECRET", "")

    # Stripe
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # Stripe Price IDs
    STRIPE_PRICE_BASICO = os.getenv("STRIPE_PRICE_BASICO", "")
    STRIPE_PRICE_CRESCIMENTO = os.getenv("STRIPE_PRICE_CRESCIMENTO", "")
    STRIPE_PRICE_AVANCADO = os.getenv("STRIPE_PRICE_AVANCADO", "")
    STRIPE_PRICE_ENTERPRISE = os.getenv("STRIPE_PRICE_ENTERPRISE", "")

    # OpenAI AI (LLM principal)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    MODEL_LLM = os.getenv("OPENAI_MODEL", "gpt-5-mini")

    # Maintenance / Dev Pass
    ENABLE_DEV_PASS = os.getenv("ENABLE_DEV_PASS", "false").lower() == "true"
    DEV_PASS_SECRET = os.getenv("DEV_PASS_SECRET", "")

settings = Settings()
