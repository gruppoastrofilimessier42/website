import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { userResourceSchema } from '../resources/user';
import { getUserResourceById } from './users';


const withEmailAndPassword = async (email: string, password: string) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth,email, password);
  const userResource = await getUserResourceById(userCredential.user.uid);
  console.log('userResource :>> ', userResource);
  return userResourceSchema.parse(userResource)
}

export default {
  withEmailAndPassword
}