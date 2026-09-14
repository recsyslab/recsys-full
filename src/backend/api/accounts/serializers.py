from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction, IntegrityError

from api.accounts.models import CustomUser
from api.online.models import User
from api.online.utils import hash


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"]
        hashed = hash(email)

        # すでに同じ email_hash が存在したら登録不可
        if User.objects.filter(email_hash=hashed).exists():
            raise serializers.ValidationError("このメールアドレスは既に登録されています。")

        attrs["email_hash"] = hashed
        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        hashed = validated_data["email_hash"]

        try:
            with transaction.atomic():
                # 1. online.User を作成（暗号化＋ハッシュ）
                profile = User()
                profile.set_email(email)  # 内部で encrypt + email_hash を設定
                profile.save()

                # 2. CustomUser を作成
                custom_user = CustomUser.objects.create(
                    username=hashed,
                    password=make_password(password),
                    user=profile,
                )
        except IntegrityError:
            raise serializers.ValidationError("このメールアドレスは既に登録されています。")

        # 3. JWT 発行
        refresh = RefreshToken.for_user(custom_user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "user_id": str(profile.user_id),
                # "email": profile.get_email()
            },
        }


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"]
        password = attrs["password"]
        hashed = hash(email)

        # 1. online.User を email_hash で取得
        try:
            profile = User.objects.get(email_hash=hashed)
        except User.DoesNotExist:
            raise serializers.ValidationError("メールアドレスまたはパスワードが正しくありません。")

        # 2. CustomUser を profile.user から取得
        try:
            custom_user = CustomUser.objects.get(user=profile)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("メールアドレスまたはパスワードが正しくありません。")

        # 3. パスワードチェック
        if not check_password(password, custom_user.password):
            raise serializers.ValidationError("メールアドレスまたはパスワードが正しくありません。")

        # 認証成功
        attrs["user"] = custom_user
        attrs["profile"] = profile
        return attrs

    def create(self, validated_data):
        custom_user = validated_data["user"]
        profile = validated_data["profile"]

        refresh = RefreshToken.for_user(custom_user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "user_id": str(profile.user_id),
                # "email": profile.get_email(),
            },
        }


class SignOutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs["refresh"]
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            pass


class MeSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.user_id", allow_null=True)
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            "id",         # Django auth のユーザID
            "user_id",    # online.usersテーブル側のID
            "user_email"  # 復号したemail
        )

    def get_user_email(self, obj):
        if obj.user is None:
            return None
        try:
            return obj.user.get_email()
        except Exception:
            return None