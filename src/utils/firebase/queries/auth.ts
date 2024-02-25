import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { userResourceSchema } from '../resources/user';
import { getUserResourceById } from './users';


export const withEmailAndPassword = async (email: string, password: string) => {
  const auth = getAuth();
  console.log('auth :>> ', auth);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log('userCredential :>> ', userCredential.user.uid);
  const userResource = await getUserResourceById(userCredential.user.uid);
  console.log('userResource :>> ', userResource);
  return userResourceSchema.parse(userResource)
}

export default {
  withEmailAndPassword
}