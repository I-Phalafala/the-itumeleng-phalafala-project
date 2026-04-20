"use client";

import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (!firebaseUser) {
        // Clear the session cookie and redirect to login
        clearSessionCookie();
        router.replace("/admin/login");
      }
    });

    return unsubscribe;
  }, [router]);

  return { user, loading };
}
