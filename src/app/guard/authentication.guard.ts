import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authenticationGuard: CanActivateFn = (route, state) => {

  debugger
  const token=localStorage.getItem('SecurityKey')
  const router=inject(Router);

  if (token) {
    return true
  }
  else
  {
    router.navigate(['/'])
    return false
  }
};
