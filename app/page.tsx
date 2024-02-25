'use client'
import Header from '@/components/header/Header';
import { User } from '@/entities/User';
import { Firebase } from '@/utils/firebase/firebase';
import { useEffect, useState } from 'react';
import {createUser} from '../src/services/manageUsers';
import './global.css'
import FormComponent from '@/components/form/FormComponent';
import auth, {withEmailAndPassword} from '@/utils/firebase/queries/auth'
import { getAuth } from 'firebase/auth';
import { set } from 'zod';
import { MyThemeContextProvider } from '@/stores/global/themeContext';
import ThemeToggleButton from '@/components/buttons/ThemeToggleButton';
import MainLayout from '@/layouts/MainLayout';

const MyApp = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [register, setRegister] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const initializeFirebase = async () => {
    await Firebase.initialize();
  }

//   const setUser = async () => {
//     await authService.withEmailAndPassword('quentin.block94@ethereal.email', 'cacca123321')
//     setUsers(await getUsers())
//   }
//  const createUserz = async (user) => createUser({name:"aa", surname:"vv", type:"a43n4k-fnlnw-dnwlmxwklmx",email:"quentin.block94@ethereal.email", password:"cacca123321"})
 const createUserz = async (user: any) => createUser(user)

 const login = async (user: any) => {
  try {
    // const response = await auth.withEmailAndPassword(user.email, user.password)
    const response = await withEmailAndPassword(user.email, user.password)
    if (response) {
      setIsLoggedIn(true)
      console.log('Login effettuato',response)
    }
  } catch (error) {
    console.log('Errore nel login', error)
  }
 }

 const logout = async () => {
  try {
    const auths = getAuth()
    await auths.signOut()
    setIsLoggedIn(false)
  } catch (error) {
    console.log('Errore nel logout', error)
  }
}

 const handleClickButton = (type: string) => {
  type === 'signup' ? setRegister(true) : setRegister(false)
  }
  
  useEffect(() => {
    initializeFirebase();
    // setUser();
    // createUserz()
  }, []);

  useEffect(() => {
    console.log(register)
  }, [register])

  const changeTheme = () => {
    if(document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
    } else {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
    }
  }


  return (
    <MyThemeContextProvider>
      <MainLayout>

        <div style={{ width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center' }} className=' dark:bg-gray-700 bg-gray-200'>
          <div style={{ maxWidth: 500, maxHeight: 800, backgroundColor: 'grey', padding: 24 }}>
            {register && <FormComponent onSubmit={createUserz} formType="signup" />}
            {!register && <FormComponent onSubmit={login} formType="login" />}
          </div>
          {!isLoggedIn && <div style={{ zIndex: 99999}}>
            <button
              onClick={() => handleClickButton('signup')}
              style={{
                padding: 12,
                width: 124,
                height: 48,
                borderRadius: 12,
                backgroundColor: register ? 'blue' : 'grey',
                marginInline: 8,
                marginTop: 16,
              }}
            >
              Register
            </button>
            <button
              onClick={() => handleClickButton('login')}
              style={{
                padding: 12,
                width: 124,
                height: 48,
                borderRadius: 12,
                backgroundColor: !register ? 'green' : 'grey',
                marginInline: 8,
                marginTop: 16,
              }}
            >
              Login
            </button>
          </div>}
          {isLoggedIn && <div style={{ zIndex: 99999}}>
            <button
              onClick={() => logout()}
              style={{
                padding: 12,
                width: 124,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'red',
                marginInline: 8,
                marginTop: 16,
              }}
            >
              Logout
            </button>
          </div>}
          <div>{users.map((user) => user.fullName)}</div>
        </div>
      </MainLayout>
    </MyThemeContextProvider>
  )
};

export default MyApp;
