from rest_framework import serializers 
from django.contrib.auth.models import User
from django.db import transaction
from .models import Medicine, Supplier, Sale, Profile

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class MedicineSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(write_only=True)
    supplier = SupplierSerializer(read_only=True)

    class Meta:
        model = Medicine
        fields = '__all__'
    
    def create(self, validated_data):
        supplier_name = validated_data.pop('supplier_name')
        try:
            supplier = Supplier.objects.get(name=supplier_name)
        except Supplier.DoesNotExist:
            raise serializers.ValidationError(f"Supplier '{supplier_name}' does not exist")

        name = validated_data.get('name')
        batch_number = validated_data.get('batch_number')
        quantity = validated_data.get('quantity', 0)

        # If same medicine (by name+batch) exists, increment its quantity and update other fields
        try:
            medicine = Medicine.objects.get(name=name, batch_number=batch_number)
            medicine.quantity = (medicine.quantity or 0) + (quantity or 0)
            for attr in ('price', 'category', 'expiry_date'):
                if attr in validated_data:
                    setattr(medicine, attr, validated_data[attr])
            medicine.save()
            return medicine
        except Medicine.DoesNotExist:
            medicine = Medicine.objects.create(supplier=supplier, **validated_data)
            return medicine
    
    def update(self, instance, validated_data):
        supplier_name = validated_data.pop('supplier_name', None)
        if supplier_name:
            try:
                supplier = Supplier.objects.get(name=supplier_name)
            except Supplier.DoesNotExist:
                raise serializers.ValidationError(f"Supplier '{supplier_name}' does not exist")
            instance.supplier = supplier

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class SaleSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(write_only=True)
    medicine = MedicineSerializer(read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
    
    def create(self, validated_data):
        medicine_name = validated_data.pop('medicine_name')
        try:
            medicine = Medicine.objects.get(name=medicine_name)
        except Medicine.DoesNotExist:
            raise serializers.ValidationError(f"Medicine '{medicine_name}' does not exist")
        qty = validated_data.get('quantity_sold', 0)
        if medicine.quantity < qty:
            raise serializers.ValidationError(f"Not enough stock for '{medicine_name}'")

        # decrement stock atomically and create sale
        with transaction.atomic():
            medicine.quantity = medicine.quantity - qty
            medicine.save()
            sale = Sale.objects.create(medicine=medicine, **validated_data)
        return sale

    def update(self, instance, validated_data):
        medicine_name = validated_data.pop('medicine_name', None)
        if medicine_name:
            try:
                medicine = Medicine.objects.get(name=medicine_name)
            except Medicine.DoesNotExist:
                raise serializers.ValidationError(f"Medicine '{medicine_name}' does not exist")
            instance.medicine = medicine

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, required=False, default="pharmacist")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        role = validated_data.get('role', 'pharmacist')
        user = User(username=username)
        user.set_password(password)
        if role == 'admin':
            user.is_superuser = True
            user.is_staff = True
        user.save()
        Profile.objects.create(user=user, role=role)
        return user

