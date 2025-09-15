import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth'; // Explicitly import authState
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe( // Use authState function with the auth instance
    map(user => {
      if (user) {
        return true; // User is logged in, allow access
      } else {
        router.navigate(['/login']); // User is not logged in, redirect to login
        return false;
      }
    })
  );
};