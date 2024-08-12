import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db, auth, storage } from '../firebase/firebaseConnection';
import React, { useState, useRef, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { Post } from '../models/interfaces/Post';

function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isNewPostFormValid, setIsNewPostFormValid] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [postAutorInput, setPostAutorInput] = useState('');
  const [postTitleInput, setPostTitleInput] = useState('');
  const [postDescriptionInput, setPostDescriptionInput] = useState('');
  const [postImgFile, setPostImgFile] = useState<File | null>(null);
  const cancelButtonRef = useRef(null);

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => toast.success('Logout feito com sucesso!'))
      .catch(() => toast.error('Erro! Tente novamente!'))
  };

  const handleInputForm = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    state: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const eventTarget = event.currentTarget as HTMLInputElement;
    const eventValue = eventTarget.value;
    
    eventValue && state(eventValue);
    console.log(eventValue)
  };

  const handlePostImageInput = (event: React.FormEvent<HTMLInputElement>) => {
    const eventTarget = event.currentTarget  as HTMLInputElement;
    const file: File | null = eventTarget.files && eventTarget.files[0];

    setPostImgFile(file)
  }

  const handleCreateNewPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (postAutorInput.trim().length > 0 && postTitleInput.trim().length > 0 && postDescriptionInput.trim().length > 0) {
      setIsNewPostFormValid(true);
    } else {
      setIsNewPostFormValid(false);
    }

    if (!postImgFile) return;

    const storageRef = ref(storage, `images/${postImgFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, postImgFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
        setProgress(progress);
      },
      () => {toast.error(
        'Erro ao criar a operação');
      },
      async() => {
        void(await getDownloadURL(uploadTask.snapshot.ref)
          .then(async (url) => {
            if (url) {
              setImageUrl(url);
              const currentDate = getCurrentDate();
              const postObject: Post = {
                autor: postAutorInput,
                title: postTitleInput,
                description: postDescriptionInput,
                imageUrl: url,
                userEmail: 'testea@teste.com',
                creationDate: currentDate
              };

              await addDoc(collection(db, 'posts'), postObject)
                .then(() => {
                  setIsLoading(false);
                  setPostTitleInput('');
                  setPostDescriptionInput('');
                  setPostAutorInput('');
                  setImageUrl('');
                  setProgress(0);
                  setIsNewPostFormValid(true);
                  setOpenModal(false);
                  toast.success('Post criado com sucesso!');
                })
                .catch(() => {
                  setIsLoading(false);
                  setPostTitleInput('');
                  setPostDescriptionInput('');
                  setPostAutorInput('');
                  setImageUrl('');
                  setProgress(0);
                  setOpenModal(false);
                  toast.error('Erro ao criar o post, tente novamente!');
                });
            }

          })
          .catch(() => {
            setIsLoading(false);
            toast.error('Erro ao fazer upload da imgem!')
          }));
      }
    );

    setIsLoading(false);
  };

  const getCurrentDate = (): string => {
    const date = new Date();

    const currentDay = String(date.getDate()).padStart(2, '0');
    const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
    const currentYear = date.getFullYear();
    return `${currentDay}/${currentMonth}/${currentYear}`;
  };

  return (
    <>
      <div className='w-full mx-auto flex flex-wrap gap-5 p-5 flex-col md:flex-row items-center bg-blue-700'>
        <button
          onClick={() => setOpenModal(!openModal)}
          type='button'
          className='inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outloine-offser-2 focus-visible:outiline-orange-700 mt-4 md:mt-0 border-0'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none' viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6 mr-2'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>

          Add Operação
        </button>

        <div className='md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center'>
          <h1 className='text-4xl text-orange-300 font-sans'>Operações Infraestrutura</h1>
        </div>

        <button
          onClick={handleSignOut}
          type='button'
          className='inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 border-0 mt-4 md:mt-0'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6 mr-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
            />
          </svg>
          Sair
        </button>
      </div>

      <Transition show={openModal} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpenModal}>
          <Transition
            as={Fragment}
            enter='ease-out diration-300'
            enterFrom='opacity-0'
            enterTo='opacity-10'
            leave='ease-in duration 200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed bg-purple-700 bg-opacity-75 transition-opacity' />
          </Transition>
          <div className='fixed inset-0 z-10 overflow-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition
                as={Fragment}
                enter='ease-out diration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-10 translate-y-0 sm:scale-100'
                leave='ease-in duration 200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel>
                  <div className='flex flex-col justify-center h-min'>
                    <form onSubmit={handleCreateNewPost} className='max-w-[400px] w-full mx-auto bg-purple-600 p-8 px-8 rounded-lg'>
                      <h2 className='text-3xl mb-5 dark:text-white font-bold text-center'>Add Operação</h2>
                      <div className='flex flex-col text-start text-white py-2'>
                        <label>Autor</label>
                        <input
                          onChange={(event) => handleInputForm(event, setPostAutorInput)}
                          type="text"
                          placeholder='Nome do usuário'
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid? `bg-purple-700` : `bg-red-600`}
                            bg-purple-700 focus:bg-purple-800 hover:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className='flex flex-col text-start text-white py-2'>
                        <label>Título</label>
                        <input
                          onChange={(event) => handleInputForm(event, setPostTitleInput)}
                          type="text"
                          placeholder='Titulo da Operação'
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid? `bg-purple-700` : `bg-red-600`}
                            bg-purple-700 focus:bg-purple-800 hover:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className='flex flex-col text-start text-white py-2'>
                        <label>Observação</label>
                        <textarea
                        onChange={(evenvt) => handleInputForm(evenvt, setPostDescriptionInput)}
                          placeholder='Descreva a observação'
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid? `bg-purple-700` : `bg-red-600`}
                            bg-purple-700 focus:bg-purple-800 hover:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className='flex flex-col text-start text-white py-2'>
                        <label>Capa</label>
                        <input
                          onChange={handlePostImageInput}
                          type='file'
                          placeholder='Titulo da Operação'
                          className="w-full cursor-pointer rounded-lg mt-2 p-2 bg-purple-700 focus:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent"
                        />
                      </div>

                      {!imageUrl && isLoading && (
                        <progress value={progress} max='100' />
                      )}

                      {imageUrl && !isLoading && (
                        <img src={imageUrl} alt='Imagem de Capa da Operação' width={200} />
                      )}

                      <button
                        disabled={isLoading}
                        type='submit'
                        className="w-full my-5 py-2 bg-orange-500 shadow-lg hover:bg-orange-600 enabled:hover:shadow-orange-500/40 text-white font-semibold rounded-lg disabled:bg-orange-400 disabled:shadow-none enabled:shadow-orange-500/50">
                        {isLoading ? 'Adicionando Registro' : 'Adicionar'}
                      </button>

                      <button
                        onClick={() => setOpenModal(false)}
                        disabled={isLoading}
                        type='button'
                        className="w-full py-2 bg-red-500 shadow-lg  hover:bg-red-600 enabled:hover:shadow-red-500/40 text-white font-semibold rounded-lg disabled:bg-red-400 disabled:shadow-none enabled:shadow-red-500/50">
                        Cancelar
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition>
            </div>
          </div>
          </Dialog>
      </Transition>
    </>
  )
}

export default Navbar;