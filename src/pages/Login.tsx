import { useState } from 'react';
import loginImg from '../assets/fundo_login.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConnection';
import { toast } from 'react-toastify';

function Login() {
  const [displayLogin, setDisplayLogin] = useState(true);
  const [displaySignUp, setDisplaySignUp] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPasswordlInput, setLoginPasswordInput] = useState('');
  const [isLoginFormValid, setIsLoginFormValid] = useState(true);
  const [signUpEmailInput, setSignUpEmailInput] = useState('');
  const [signUpPasswordInput, setSignUpPasswordInput] = useState('');
  const [isSignUpFormValid, setIsSignUpFormValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const erroAlert = (
    <p className='flex justify-center text-red-300'>
      Preencha os campos e tente novamente!
    </p>
  );

  const handleDisplayCreateAccount = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setDisplayLogin(false);
    setDisplaySignUp(true);
  };

  const handleDisplayLogin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setDisplayLogin(true);
    setDisplaySignUp(false);
  };

  const handleInputForm = (
    event: React.FormEvent<HTMLInputElement>,
    state: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const eventTarget = event.currentTarget as HTMLInputElement;
    const eventValue = eventTarget.value;

    state(eventValue);
  };

  const handleExecuteLogin = async (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    setIsLoading(true);
    event.preventDefault();

    loginEmailInput.trim().length > 0 && loginPasswordlInput.trim().length > 0
      ? setIsLoginFormValid(true)
      : setIsLoginFormValid(false)
    
    await signInWithEmailAndPassword(
      auth,
      loginEmailInput,
      loginPasswordlInput
    ).then(() => {
      toast.success('Bem-Vindo de volta!');
      setDisplayLogin(true);
      setDisplaySignUp(false);
      setIsLoading(false);
    }).catch((err: {code: string}) => {
      if (err.code === 'auth/invalid-password') {
        toast.error('Senha incorreta!');
      } else if (err.code === 'auth/user-not-found') {
        toast.error('Email não existe, crie sua conta!');
      } else {
        toast.error('Erro ao fazer login!');
      }
      setIsLoading(false);
      setIsSignUpFormValid(false);
    });

    console.log('Dados do input', {
      email: loginEmailInput,
      senha: loginPasswordlInput
    });

    setLoginEmailInput('');
    setLoginPasswordInput('');
  };

  const handleExecuteSignUp = async (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    setIsLoading(true);
    event.preventDefault();

    signUpEmailInput.trim().length > 0 && signUpPasswordInput.trim().length > 0
      ? setIsSignUpFormValid(true)
      : setIsSignUpFormValid(false)

    await createUserWithEmailAndPassword(
      auth,
      signUpEmailInput,
      signUpPasswordInput
    ).then(() => {
      setDisplayLogin(true);
      setDisplaySignUp(false);
      setIsLoading(false);
      toast.success('Usuário Criado com Sucesso!');
    }).catch((err: {code: string}) => {
      if (err.code === 'auth/weak-password') {
        toast.error('Senha muito fraca, ultilize outra senha!');
      } else if (err.code === 'auth/email-already-in-use') {
        toast.error('Email já cadastrado!');
      } else {
        toast.error('Erro ao criar usuário!');
      }

      setIsLoading(false);
      setIsSignUpFormValid(false);
    });

    setLoginEmailInput('');
    setLoginPasswordInput('');
  };


  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hiden sm:block'>
        <img className='w-full h-screen object-cover' src={loginImg} alt='Imagem de um notebook' />
      </div>
      <div className='flex flex-col justify-center'>
        <div className='flex flex-col justify-center items-center mb-14'>
          <h1 className='text-4xl text-orange-500 text-center font-semibold'>Megalink Telecom</h1>
        </div>

        {displayLogin && (
          <form onSubmit={handleExecuteLogin} className='max-w-[400px] w-full mx-auto bg-purple-600 p-8 rounded-lg'>
            <h2 className='text-4xl dark:text-white font-bold text-center'>Login</h2>
            <div className='flex flex-col text-white py-2'>
              <label>Email</label>
              <input
                value={loginEmailInput}
                onChange={(e) => handleInputForm(e, setLoginEmailInput)}
                type="email"
                className={`rounded-lg mt-2 p-2 ${
                  isLoginFormValid ? `bg-purple-700 focus:bg-purple-800 hover:bg-purple-800` : `bg-red-700 focus:bg-red-800`
                } focus:bg-orange-500 focus:outline-none focus:placeholder-transparent border-2`}
                placeholder='Digite seu e-mail'
              />
            </div>
            <div className='flex flex-col text-white py-2'>
              <label>Senha</label>
              <input
                value={loginPasswordlInput}
                onChange={(e) => handleInputForm(e, setLoginPasswordInput)}
                type="password"
                className={`rounded-lg mt-2 p-2 ${
                  isLoginFormValid ? `bg-purple-700 focus:bg-purple-800 hover:bg-purple-800` : `bg-red-700 focus:bg-red-800`
                } focus:bg-orange-500 focus:outline-none focus:placeholder-transparent border-2`}
                placeholder='Digite sua senha'
                maxLength={10}
                minLength={6}
              />
            </div>
            <div className='flex justify-center text-white py-2 hover:cursor-pointer hover:animate-pulse'>
              <button disabled={isLoading} type='button' onClick={(event) => handleDisplayCreateAccount(event)}>
                Criar Conta
              </button>
            </div>
            {!isLoginFormValid && erroAlert}
            <button type='submit' className='w-full my-5 py-2 rounded-md hover:bg-orange-700 bg-orange-600 shadow-lg enabled:hover:shadow-orange-500/40 text-white font-semibold disabled:bg-orange-300 disabled:shadow-none enabled:shadow-orange-500/50'>
              Fazer Login
            </button>
          </form>
        )}

        {displaySignUp && (
          <form onSubmit={handleExecuteSignUp} className='max-w-[400px] w-full mx-auto bg-purple-600 p-8 rounded-lg'>
            <h2 className='text-4xl dark:text-white font-bold text-center'>Criar Conta</h2>
            <div className='flex flex-col text-white py-2'>
              <label>Email</label>
              <input
                value={signUpEmailInput}
                onChange={(e) => handleInputForm(e, setSignUpEmailInput)}
                type="email"
                className={`rounded-lg mt-2 p-2 ${
                  isSignUpFormValid ? `bg-purple-700 focus:bg-purple-800 hover:bg-purple-800` : `bg-red-700 focus:bg-red-800`
                } focus:bg-orange-500 focus:outline-none focus:placeholder-transparent border-2`}
                placeholder='Digite seu e-mail'
              />
            </div>
            <div className='flex flex-col text-white py-2'>
              <label>Email</label>
              <input
                value={signUpPasswordInput}
                onChange={(e) => handleInputForm(e, setSignUpPasswordInput)}
                type="password"
                className={`rounded-lg mt-2 p-2 ${
                  isSignUpFormValid ? `bg-purple-700 focus:bg-purple-800 hover:bg-purple-800` : `bg-red-700 focus:bg-red-800`
                } focus:bg-orange-500 focus:outline-none focus:placeholder-transparent border-2`}
                placeholder='Crie sua senha de 6 a 10 caracteres'
                maxLength={10}
                minLength={6}
              />
            </div>
            <div className='flex justify-center text-white py-2 hover:cursor-pointer hover:animate-pulse'>
              <button type='button' onClick={(event) => handleDisplayLogin(event)}>Fazer Login</button>
            </div>
            {!isSignUpFormValid && erroAlert}
            <button disabled={isLoading} type='submit' className='w-full my-5 py-2 rounded-md hover:bg-orange-600 bg-orange-500 shadow-lg enabled:hover:shadow-orange-500/40 text-white font-semibold disabled:bg-orange-300 disabled:shadow-none enabled:shadow-orange-500/50'>
              {isLoading ? 'Carregando...' : 'Criar Conta'}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default Login;