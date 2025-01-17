import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Component/OAuth';

function Signup() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

     const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.id]: e.target.value.trim() });
 
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all Fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
     if (data.success === false){
      setErrorMessage(data.message);
      setLoading(false);
     }
     setLoading(false);
     if(res.ok) {
       navigate('/signin');
     }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className=' flex p-3 max-w-3xl mx-auto gap-4 flex-col md:flex-row md:items-center'>
        {/* left */}
        <div className='flex-1'>
        <Link to='/' className='font-bold dark:text-white text-4xl'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
          via-purple-500 to-pink-500 rounded-lg text-white'>
            Fullstack
            </span>
            Blog
        </Link>
        <p className='text-sm mt-5 font-semibold'>This is a blogging website developed using the Mern stack framework
          and tailwind css studies using vite</p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput type='email' placeholder='Email' id='email'onChange={handleChange} />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
             {
              loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading....</span>
                </>
               ) : 'Sign Up'
             }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'> 
            <span> Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                 {errorMessage}
              </Alert>
            )
          }
       </div>
      </div>
    </div>
  )
}

export default Signup
