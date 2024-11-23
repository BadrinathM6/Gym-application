from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import LoginSerializer, UserSerializer, DietaryPreferenceSerializer, BodyTypeProfileSerializer, PhysicalProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import DietaryPreference, BodyTypeProfile, PhysicalProfile

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        password = request.data.get('password')

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

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request): 
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        return self.put(request)
    
class AgeUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def put(self, request):
        """
        Update user's age
        """
        age = request.data.get('age')
        
        if age is None:
            return Response(
                {'error': 'Age is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = UserSerializer(
            request.user,
            data={'age': age},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """
        Get user's age
        """
        serializer = UserSerializer(request.user)
        return Response({'age': serializer.data.get('age')}, status=status.HTTP_200_OK)
    
class DietaryPreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            dietary_preference = DietaryPreference.objects.get(user=request.user)
            serializer = DietaryPreferenceSerializer(dietary_preference)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DietaryPreference.DoesNotExist:
            return Response({'message': 'No dietary preferences set'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = DietaryPreferenceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            dietary_preference = DietaryPreference.objects.get(user=request.user)
            serializer = DietaryPreferenceSerializer(
                dietary_preference, 
                data=request.data, 
                partial=True, 
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DietaryPreference.DoesNotExist:
            return self.post(request)
        
class PhysicalProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            profile = PhysicalProfile.objects.get(user=request.user)
            serializer = PhysicalProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PhysicalProfile.DoesNotExist:
            return Response(
                {'message': 'Physical profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request):
        serializer = PhysicalProfileSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                **serializer.data,
                'bmi': profile.bmi,
                'bmi_category': profile.bmi_category
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            profile = PhysicalProfile.objects.get(user=request.user)
            serializer = PhysicalProfileSerializer(
                profile,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                profile = serializer.save()
                return Response({
                    **serializer.data,
                    'bmi': profile.bmi,
                    'bmi_category': profile.bmi_category
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PhysicalProfile.DoesNotExist:
            return self.post(request)

class BodyTypeProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            profile = BodyTypeProfile.objects.get(user=request.user)
            serializer = BodyTypeProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BodyTypeProfile.DoesNotExist:
            return Response(
                {'message': 'Body type profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request):
        serializer = BodyTypeProfileSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            profile = BodyTypeProfile.objects.get(user=request.user)
            serializer = BodyTypeProfileSerializer(
                profile,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BodyTypeProfile.DoesNotExist:
            return self.post(request)