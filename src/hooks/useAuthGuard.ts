"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { clearSessionCookie } from "@/lib/auth/session";

/**
 * Client-side hook that checks Firebase Auth state and redirects
 * unauthenticated users to `/admin/login`.
 *
 * Returns the current Firebase user (or `null`) along with a
 * boolean `loading` flag that is `true` while the initial auth
 * check is in progress.
 */
export function useAuthGuard(): { user: User | null; loading: boolean } {
  const router = useRouter();
  // Use a ref so the callback always has the latest router without
  // causing the effect to tear down and re-create the subscription.
  const routerRef = useRef(router);
  routerRef.current = router;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (!firebaseUser) {
        // Clear the session cookie and redirect to login
        clearSessionCookie();
        routerRef.current.replace("/admin/login");
      }
    });

    return unsubscribe;
  }, []); // Subscribe once on mount – router is accessed via ref

  return { user, loading };
}
