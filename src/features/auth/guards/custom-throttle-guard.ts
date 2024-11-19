import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class NotTestingThrottleGuard
  extends ThrottlerGuard
  implements CanActivate
{
  async canActivate(context: ExecutionContext) {
    if (process.env.MODE === 'TESTING') {
      return true;
    }
    return super.canActivate(context);
  }
}
