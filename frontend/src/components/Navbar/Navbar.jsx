import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">BNV</span>
        </Link>
        <span className="navbar-title">MERN stack developer practical task</span>
        <div className="navbar-spacer" />
      </div>
    </nav>
  )
}

export default Navbar
