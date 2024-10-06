import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Get the required permissions from metadata
        const requiredPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );

        // If no permissions are required, allow access
        if (!requiredPermissions) {
            return true;
        }

        // Check if user has any of the required permissions (use `some` if any permission is enough)
        const hasPermission = requiredPermissions.some(
            (permission) => user.permissions?.[permission],
        );

        if (hasPermission) {
            return true;
        }

        throw new ForbiddenException(
            'You do not have the required permissions',
        );
    }
}
