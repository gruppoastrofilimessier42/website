import { collection, getDocs } from "firebase/firestore";
import { UserResource } from "../../../entities/User";
import { getDatabase } from "../firestore"

export const getUsers = async () => {
  const db = await getDatabase();
  const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((docs) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docs.id, ' => ', docs.data())
    })
}

export const createUser = async (userResource: UserResource) => {
  const db = await getDatabase();
  const querySnapshot = await getDocs(collection(db, 'users'))
}