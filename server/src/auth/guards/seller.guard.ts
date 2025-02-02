import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SellerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.permissions?.['sale']) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to sell');
    }
}
