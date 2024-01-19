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


export const getUserResourceById = async (id: string): Promise<UserResource | null> => {
  try {
    const db = await getDatabase()
    const userDoc = (await getDoc(doc(db, 'users', id))).data()
    if (!userDoc) return null
    userDoc.id = id
    userDoc.type = {id: userDoc.type}
    userDoc.type = {...userDoc.type, ...(await getDoc(doc(db, 'users-types', userDoc.type.id))).data()}
    console.log('userDoc :>> ', userDoc)

    return userResourceSchema.parse(userDoc)

  } catch (error) {
    console.error('Error getting user document:', error)
    throw error
  }
}




export const saveUser = async (userRequest: UserRequest, uid: string) => {
  const db = await getDatabase();
  // TODO settare random ID
  await setDoc(doc(db, 'users', uid), userRequest);
}