"""ユーザデータを暗号化する。
@version 20260806
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
parser.add_argument('--in_csv', type=str)
parser.add_argument('--out_csv', type=str)

args = parser.parse_args()


# データセットを読み込む。
in_csv = pathlib.Path(args.in_csv)
df_users = pd.read_csv(in_csv, index_col=None, sep='\t')


# ユーザデータを暗号化する。
users = []
for user_ in tqdm(df_users.itertuples(), total=len(df_users), desc='processing users'):
  user_id = user_.user_id
  email = user_.email
  email_encrypted = encrypt(email)
  email_hash = hash(email)
  users.append([user_id, email_encrypted, email_hash])


# データを出力する。
df = pd.DataFrame(users, columns=['user_id', 'email_encrypted', 'email_hash'])
df.to_csv(args.out_csv, header=True, index=False, encoding='utf-8', sep='\t')


elapsed_time = time.time() - start
print('elapsed_time:{:.3f}'.format(elapsed_time) + '[sec]')
