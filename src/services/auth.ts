import { User } from "@/entities/User";
import auth from "@/utils/firebase/queries/auth"

const withEmailAndPassword = async (email: string, password: string) => {
  const userResource = await auth.withEmailAndPassword(email, password);
  return new User(userResource)
}

export default {
  withEmailAndPassword
}