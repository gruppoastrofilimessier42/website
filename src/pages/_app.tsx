import Header from '@/components/header/Header';
import { User, UserResource } from '@/entities/User';
import { getUsers } from '@/services/getUsers';
import { Firebase } from '@/utils/firebase/firebase';
import { useEffect, useState } from 'react';
import '../styles/global.css';

const MyApp = () => {

  const [users, setUsers] = useState<User[]>([]);

  const initializeFirebase = async () => {
    await Firebase.initialize();
  }

  const setUser = async () => setUsers(await getUsers())

  
  useEffect(() => {
    initializeFirebase();
    setUser();
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
