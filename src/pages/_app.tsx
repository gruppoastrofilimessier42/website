import Header from '@/components/header/Header';
import { Firebase } from '@/utils/firebase/firebase';
import { useEffect } from 'react';
import '../styles/global.css';

const MyApp = () => {

  const initializeFirebase = async () => {
    await Firebase.initialize();
  }
  
  useEffect(() => {
    initializeFirebase();
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
