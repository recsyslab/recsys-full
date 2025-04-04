"""ユーザデータを暗号化する。
@version 20250322
"""
import os
import argparse
import pathlib
import time
from tqdm import tqdm

import hashlib
from cryptography.fernet import Fernet

import pandas as pd


ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY')

# Fernetオブジェクトを作成
cipher = Fernet(ENCRYPTION_KEY.encode())

def encrypt(text: str) -> str:
    """textを暗号化する。
    """
    return cipher.encrypt(text.encode()).decode()

def decrypt(encrypted_text: str) -> str:
    """encrypted_textを復号化する。
    """
    return cipher.decrypt(encrypted_text.encode()).decode()

def hash(text: str) -> str:
    """textのハッシュ値 (SHA256)を生成する。
    """
    return hashlib.sha256(text.encode()).hexdigest()


start = time.time()

parser = argparse.ArgumentParser()
parser.add_argument('--in_dir', type=str)

args = parser.parse_args()
# args = parser.parse_args(args=[
#     '--in_dir', '../data/',
# ])


# データセットを読み込む。
in_dir = pathlib.Path(args.in_dir)
df_users = pd.read_csv(in_dir / 'users_.csv', index_col=None, sep='\t')


# ユーザデータを暗号化する。
users = []
for user_ in tqdm(df_users.itertuples(), total=len(df_users), desc='processing users'):
  id = user_.id
  email = user_.email
  email_encrypted = encrypt(email)
  email_hash = hash(email)
  users.append([id, email_encrypted, email_hash])


# データを出力する。
df = pd.DataFrame(users, columns=['id', 'email_encrypted', 'email_hash'])
df.to_csv(in_dir / 'users.csv', header=True, index=False, encoding='utf-8', sep='\t')

