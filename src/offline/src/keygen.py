"""ENCRYPTION KEYを生成する。
@version 20250325
"""
from cryptography.fernet import Fernet

# キーを生成する。
key = Fernet.generate_key()
print(key.decode())  # key.decode()の内容を環境変数に保存する。
