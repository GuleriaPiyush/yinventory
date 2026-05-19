import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import RequestFactory
from appbackend.views import SalesGraphData
from django.contrib.auth.models import User

factory = RequestFactory()
request = factory.get('/api/sales/graph/?filter=week')
# Add a mock user to bypass auth
user, _ = User.objects.get_or_create(username='testuser')
request.user = user

try:
    response = SalesGraphData(request)
    print("STATUS:", response.status_code)
    print("CONTENT:", response.content)
except Exception as e:
    import traceback
    traceback.print_exc()
