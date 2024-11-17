from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        if not data.get('user_id') or not data.get('password'):
            raise serializers.ValidationError("User ID and password are required.")
        return data
