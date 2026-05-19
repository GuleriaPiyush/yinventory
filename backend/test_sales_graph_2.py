import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from appbackend.views import SalesGraphData
from django.contrib.auth.models import User

factory = APIRequestFactory()
request = factory.get('/api/sales/graph/?filter=week')
user, _ = User.objects.get_or_create(username='testuser')
force_authenticate(request, user=user)

try:
    response = SalesGraphData(request)
    response.render()
    print("STATUS:", response.status_code)
    print("CONTENT:", response.content)
except Exception as e:
    import traceback
    traceback.print_exc()
