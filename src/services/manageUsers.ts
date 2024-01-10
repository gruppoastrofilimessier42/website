import { saveUser } from "@/utils/firebase/queries/users";
import { UserRequest, userRequestSchema } from "@/utils/firebase/resources/user";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";


export const createUser = async (userRequest: UserRequest) => {
  const auth = getAuth()
  try {
    const validUserRequest = userRequestSchema.parse(userRequest);
    // const {user} = await createUserWithEmailAndPassword(auth, "quentin.block94@ethereal.email", "Fk7Mw72vXfnsWhRZDM")
    const {user} = await createUserWithEmailAndPassword(auth, validUserRequest.email, validUserRequest.password)
    await saveUser(validUserRequest);
    console.log('salvatooo :>> ');
    // console.log('user :>> ', user);
    await sendEmailVerification(user)
    await auth.signOut()
  } catch (error) {
    // TODO se nostro utente non viene salvato, elimina utente in auth
    console.log('error :>> ', error);
  }
}