import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, firestore } from "../APIS/config";
import { getUser } from "../APIS";
import { authHandler } from "../store/reducers";
import { roleOf } from "../utils/session";
export const AuthSync = ({ children }) => {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let active = true;
    let revision = 0;
    const unsubscribe = auth.onAuthStateChanged(async (account) => {
      const current = ++revision;
      let administrator = false;
      let profile = null;
      try {
        if (account) {
          administrator = (
            await firestore.collection("Admin").doc(account.uid).get()
          ).exists;
          if (!administrator) {
            const record = await getUser(account.uid);
            profile = roleOf(record) ? record : null;
          }
        }
      } catch {
        // Fail closed. A late result from an old account must not restore its session.
      }
      if (!active || current !== revision) return;
      sessionStorage.removeItem("spms-admin");
      sessionStorage.removeItem("spms-user");
      if (administrator)
        sessionStorage.setItem(
          "spms-admin",
          JSON.stringify({ isAuthenticated: true, uid: account.uid }),
        );
      else if (profile)
        sessionStorage.setItem("spms-user", JSON.stringify(profile));
      dispatch(authHandler({ isAuthenticated: !!profile, user: profile }));
      setReady(true);
    });
    return () => {
      active = false;
      revision++;
      unsubscribe();
    };
  }, [dispatch]);
  return ready ? (
    children
  ) : (
    <div className="app-loading" role="status">
      Loading SPMS…
    </div>
  );
};
