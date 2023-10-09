import React,{useState} from 'react';
import { MyContext } from './Context'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './router/StackNavigation'


const App = () => {

  return (
    <MyProvider>
      <NavigationContainer>
        <MainStack/>
    </NavigationContainer>
    </MyProvider>
  )
}


export default App;


function MyProvider({ children }) {
  const [state, setState] = useState({});
  const [CurrentSemesterContext, setCurrentSemesterContext] = useState({});
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const showFlash = (message) => {
    setMessage(message);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setMessage(null);
    }, 3000);
  };

  return (
    <MyContext.Provider 
    value={{ showFlash, message, isVisible, state, setState ,CurrentSemesterContext, setCurrentSemesterContext }}
   >
      {children}
    </MyContext.Provider>
  );
}
