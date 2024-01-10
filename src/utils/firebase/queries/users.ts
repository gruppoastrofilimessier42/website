import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getDatabase } from "../firestore"
import { UserRequest, UserResource, userResourceSchema } from "../resources/user";

export const getUsersResources = async (): Promise<UserResource[]> => {
  const db = await getDatabase();
  const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((docs) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docs.id, ' => ', docs.data())
    })
    const userDocs = querySnapshot.docs.map(document => document.data());
    const userResources = userDocs.map(userDoc => userResourceSchema.parse(userDoc));
    return userResources;
}

export const getUserResourceById = async (id: string): Promise<UserResource> => {
  const db = await getDatabase();
  const userDoc = await getDoc(doc(db, 'users', id));
  return userResourceSchema.parse(userDoc.data());
}


export const saveUser = async (userRequest: UserRequest) => {
  const db = await getDatabase();
  // TODO settare random ID
  await setDoc(doc(db, 'users', 'dsdsijsdjio'), userRequest);
}