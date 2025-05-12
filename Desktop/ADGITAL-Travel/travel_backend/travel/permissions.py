from rest_framework import permissions

class IsSupportUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Vous devez être authentifié pour accéder à cette ressource.")
        if not getattr(request.user.profile, 'is_support', False):
            raise PermissionDenied("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.")

        return True

class IsCommercialUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Vous devez être authentifié pour accéder à cette ressource.")
        if not getattr(request.user.profile, 'is_commercial', False):
            raise PermissionDenied("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.")

        return True


class IsManagerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Vous devez être authentifié pour accéder à cette ressource.")
        if not getattr(request.user.profile, 'is_manager', False):
            raise PermissionDenied("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.")

        return True


class IsComptableUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Vous devez être authentifié pour accéder à cette ressource.")
        if not getattr(request.user.profile, 'is_comptable', False):
            raise PermissionDenied("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.")

        return True