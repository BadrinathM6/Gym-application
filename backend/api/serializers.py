from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('user_id', 'gender')
        extra_kwargs = {'password': {'write_only': True}}

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=128, write_only=True)
    gender = serializers.ChoiceField(choices=CustomUser.GENDER_CHOICES, required=False)

    def validate(self, data):
        if not data.get('user_id') or not data.get('password'):
            raise serializers.ValidationError("User ID and password are required.")
        return data