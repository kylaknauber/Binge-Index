import {
    createContext, useContext,
    useState, useEffect
} from "react"
import { onAuthStateChanged, getAuth } from "firebase/auth"
//import { auth } from "../api/firebase"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../api/firebase"

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        /**
         * 
         * const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
         */
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUser({
                            ...currentUser,
                            ...docSnap.data()
                        })
                    } else {
                        setUser(currentUser);
                    }
                }
                catch (error) {
                    console.log(error.message);
                    setUser(currentUser);
                }
            }
            else {
                setUser(null);
            }
            setLoading(false);
        })

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}