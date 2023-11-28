import Header from '@/components/header/Header';
import '../styles/global.css';
import { useEffect } from 'react';
import { Firebase } from '@/utils/Firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';

const MyApp = () => {

  const initializeFirebase = async () => {
    const firebase = await Firebase.initialize();
    console.log(firebase);
  }

  const initializeDatabase = async () => {
    const database = await Firebase.initDatabase();
    console.log(database);

    const querySnapshot = await getDocs(collection(database, 'users'))
    querySnapshot.forEach((docs) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docs.id, ' => ', docs.data())
    })
  }
  useEffect(() => {
    initializeFirebase();
    initializeDatabase();
  }, []);


  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Header />
      <p>Ciao Mondo</p>
      <p>Ciao Mondo numero due</p>
    </div>
  );
};

export default MyApp;
