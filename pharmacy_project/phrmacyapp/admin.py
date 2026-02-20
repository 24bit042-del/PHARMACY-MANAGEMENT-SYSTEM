from django.contrib import admin
from .models import Supplier, Medicine, Sale

# Register your models here.
admin.site.register(Supplier)
admin.site.register(Medicine)
admin.site.register(Sale)