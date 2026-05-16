from django.http import JsonResponse


def health_view(request, service_name: str):
    return JsonResponse({"status": "ok", "service": service_name})
