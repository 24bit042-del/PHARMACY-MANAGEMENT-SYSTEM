from django.urls import path
from . import views

urlpatterns = [
    path('suppliers/', views.supplier_list, name='supplier-list'),
    path('medicines/', views.medicine_list, name='medicine-list'),
    path('sales/', views.sale_list, name='sale-list'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('suppliers/<int:pk>/', views.supplier_detail, name='supplier-detail'),
    path('medicines/<int:pk>/', views.medicine_detail, name='medicine-detail'),
    path('sales/<int:pk>/', views.sale_detail, name='sale-detail'),
]
