import hashlib
from cryptography.fernet import Fernet
from django.conf import settings

## Fernetオブジェクトを作成
cipher = Fernet(settings.ENCRYPTION_KEY.encode())

def encrypt(text):
    """textを暗号化"""
    return cipher.encrypt(text.encode()).decode()

def decrypt(encrypted_text):
    """textを復号化"""
    return cipher.decrypt(encrypted_text.encode()).decode()

def hash(text):
    """textのハッシュ値を生成 (SHA256)"""
    return hashlib.sha256(text.encode()).hexdigest()


def mask_email(email: str) -> str:
    """メールアドレスをマスクして表示"""
    if not email or "@" not in email:
        return email

    local, domain = email.split("@", 1)

    if len(local) <= 1:
        masked_local = "*"
    else:
        masked_local = local[0] + "*" * (len(local) - 1)

    return f"{masked_local}@{domain}"