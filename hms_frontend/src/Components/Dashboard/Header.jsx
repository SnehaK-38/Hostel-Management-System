import {BsJustify} from 'react-icons/bs'
import profileIcon from '../Images/student-profile.png'

function Header({OpenSidebar, username}) {
  return (
    <header className='dash-header'>
        {/* Added menu-icon div back here for mobile toggle */}
        <div className='menu-icon'>
            <BsJustify className='dash-icon' onClick={OpenSidebar}/>
        </div>
        
        <div className='header-left'>
            {/* You can add a logo/title here if you want it next to the menu icon */}
        </div>
        
        <div className='header-right'>
            <p>Hey, {username}<br></br>Student</p>
            <img className='profile-icon' src={profileIcon} alt=''></img>
        </div>
    </header>
  )
}

export default Header