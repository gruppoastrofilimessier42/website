import { User } from "@/entities/User";
import { getUsersResources } from "@/utils/firebase/queries/users"
import { UserResource } from "@/utils/firebase/resources/user";

const toUser = (userResource: UserResource) => new User(userResource)

export const getUsers = async () => {
  const userResources = await getUsersResources();
  return userResources.map(toUser);
}
