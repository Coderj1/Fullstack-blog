import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../Redux/theme/themeSlice'
import { signOutSucess } from '../Redux/user/userSlice'

export default function Header() {

  const path = useLocation().pathname
  const location = useLocation()
  const dispatch = useDispatch()
  const { Currentuser } = useSelector(state => state.user)
  const { theme } = useSelector((state) => state.theme)
  const [searchTerm, SetSearchTerm] = useState('');

  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
     if (!res.ok){
       console.log(data.massage)
     } else {
       dispatch(signOutSucess())
       navigate('/signin')
     } 
    } catch (error) {
     console.log(error.message)
    }
  }

  const handleSearch  = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm')
      if(searchTermFromUrl) {
         SetSearchTerm(searchTermFromUrl)
      }
  }, [location.search])
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white'>
          Fullstack
          </span>
           Blog
      </Link>
      <form onSubmit={handleSearch} className=''>
        <TextInput
        type='text'
        placeholder='Search' 
        rightIcon={AiOutlineSearch}
        className='hidden lg:inline'
        value={searchTerm}
        onChange={(e) => SetSearchTerm(e.target.value)}
        />
      </form>
      
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <Link to='/search'>
            <AiOutlineSearch />
          </Link>
        </Button>
        
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill 
        onClick = {()=>dispatch(toggleTheme())}
        >
          { theme === 'light' ? <FaSun /> : <FaMoon /> }
        </Button>
        { Currentuser ? (
          <Dropdown 
          arrowIcon = {false}
          inline
          label={
            <Avatar alt='user'
            img={Currentuser.profilePicture}
            rounded />
           }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@ {Currentuser.username}</span>
              <span className='block text-sm font-medium truncate'>@ {Currentuser.email}</span>
            </Dropdown.Header>
            {
              Currentuser.isAdmin ? (
                <>
                <Link to='/dashboard?tab=dashboard'>
                  <Dropdown.Item>DashBoard</Dropdown.Item>
                  <Dropdown.Divider  />
                </Link>
                </>
                
              ) : (
                <span></span>
              )
            }
            <Link to='/dashboard?tab=profile'>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}> SignOut</Dropdown.Item>
          </Dropdown>  
        ):
          (
            <Link to='/signin'>
              <Button className='p-0' outline gradientDuoTone='purpleToBlue'>
                Sign In
              </Button>
            </Link> 
          )
        }
      
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
           <Navbar.Link active={ path === '/'} as={'div'}>
              <Link to='/'>
                Home
              </Link>
           </Navbar.Link>
           <Navbar.Link active={ path === '/aboutus'} as={'div'}>
              <Link to='/aboutus'>
                About Us
              </Link>
           </Navbar.Link>
           <Navbar.Link active={ path === '/project'} as={'div'}>
              <Link to='/project'>
                Project
              </Link>
           </Navbar.Link>
        </Navbar.Collapse> 
    </Navbar>
  )
}
