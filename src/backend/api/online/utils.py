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