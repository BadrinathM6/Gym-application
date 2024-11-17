from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract data from the request
        user_id = request.data.get('user_id')
        password = request.data.get('password')

        # Check if either field is missing
        if not user_id or not password:
            missing_fields = []
            if not user_id:
                missing_fields.append('user_id')
            if not password:
                missing_fields.append('password')
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use the serializer to validate input data
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Try to authenticate the user
            user = authenticate(
                user_id=serializer.validated_data['user_id'],
                password=serializer.validated_data['password']
            )

            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        # If serializer is invalid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        data = {
            'id': user.user_id,
        }
        return Response(data, status=status.HTTP_200_OK)