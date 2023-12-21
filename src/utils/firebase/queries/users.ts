import { collection, getDocs } from "firebase/firestore";
import { getDatabase } from "../firestore"
import { UserResource, userSchema } from "../resources/user";

export const getUsersResources = async (): Promise<UserResource[]> => {
  const db = await getDatabase();
  const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((docs) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docs.id, ' => ', docs.data())
    })
    const userDocs = querySnapshot.docs.map(doc => doc.data());
    const userResources = userDocs.map(userDoc => userSchema.parse(userDoc));
    return userResources;


}

export const createUser = async (userResource: UserResource) => {
  const db = await getDatabase();
  const querySnapshot = await getDocs(collection(db, 'users'))
}