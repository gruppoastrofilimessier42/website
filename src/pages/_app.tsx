import Header from '@/components/header/Header';
import { User, UserResource } from '@/entities/User';
import { getUsers } from '@/services/getUsers';
import { Firebase } from '@/utils/firebase/firebase';
import { useEffect, useState } from 'react';
import {createUser} from '../services/manageUsers';
import authService from '../services/auth';
import '../styles/global.css';

const MyApp = () => {

  const [users, setUsers] = useState<User[]>([]);

  const initializeFirebase = async () => {
    await Firebase.initialize();
  }

  const setUser = async () => {
    await authService.withEmailAndPassword('quentin.block94@ethereal.email', 'cacca123321')
    setUsers(await getUsers())
  }
const createUserz = async () => createUser({name:"aa", surname:"vv", type:"a43n4k-fnlnw-dnwlmxwklmx",email:"quentin.block94@ethereal.email", password:"cacca123321"})
  
  useEffect(() => {
    initializeFirebase();
    setUser();
    // createUserz()
  }, []);


  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Header />
      <p>Ciao Mondo</p>
      <p>Ciao Mondo numero due</p>
      <div>
          
          {users.map(user => user.fullName)}
        </div>
    </div>
  );
};

export default MyApp;
