import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";


export const createUser = async () => {
  const auth = getAuth()
  try {
    
    const {user} = await createUserWithEmailAndPassword(auth, "quentin.block94@ethereal.email", "Fk7Mw72vXfnsWhRZDM")
    await sendEmailVerification(user)
  } catch (error) {
    console.log('error :>> ', error);
  }
}