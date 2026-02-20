from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status 
from rest_framework import response
from .models import Supplier, Medicine, Sale
from .serializers import SupplierSerializer, MedicineSerializer, SaleSerializer 
from .serializers import RegisterSerializer
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

# Create your views here.

@api_view(['GET', 'POST'])
def supplier_list(request): 
    if request.method == 'GET':
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return response.Response(serializer.data)
    elif request.method == 'POST':
        serializer = SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=201)
        return response.Response(serializer.errors, status=400)
    
@api_view(['GET', 'POST'])
def medicine_list(request):
    if request.method == 'GET':
        medicines = Medicine.objects.all()
        serializer = MedicineSerializer(medicines, many=True)
        return response.Response(serializer.data)
    elif request.method == 'POST':
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=201)
        return response.Response(serializer.errors, status=400) 
    
@api_view(['GET', 'POST'])
def sale_list(request): 

    if request.method == 'GET':
        sales = Sale.objects.all()
        serializer = SaleSerializer(sales, many=True)
        return response.Response(serializer.data)
    elif request.method == 'POST':
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=201)
        return response.Response(serializer.errors, status=400) 


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        role = getattr(user.profile, 'role', None)
        return Response({
            'username': user.username,
            'role': role,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    role = getattr(user.profile, 'role', None)
    return Response({'username': user.username, 'role': role})




@api_view(['GET', 'PUT', 'DELETE'])
def supplier_detail(request, pk):
    supplier = get_object_or_404(Supplier, pk=pk)
    if request.method == 'GET':
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = SupplierSerializer(supplier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    if request.method == 'DELETE':
        supplier.delete()
        return Response(status=204)


@api_view(['GET', 'PUT', 'DELETE'])
def medicine_detail(request, pk):
    medicine = get_object_or_404(Medicine, pk=pk)
    if request.method == 'GET':
        serializer = MedicineSerializer(medicine)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = MedicineSerializer(medicine, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    if request.method == 'DELETE':
        medicine.delete()
        return Response(status=204)


@api_view(['GET', 'PUT', 'DELETE'])
def sale_detail(request, pk):
    sale = get_object_or_404(Sale, pk=pk)
    if request.method == 'GET':
        serializer = SaleSerializer(sale)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = SaleSerializer(sale, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    if request.method == 'DELETE':
        sale.delete()
        return Response(status=204)
    