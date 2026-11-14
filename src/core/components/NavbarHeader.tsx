
import {
  Layout,
  // Image,
  Row, Col,
  Grid,
  Button
} from 'antd'
import {
  LoginOutlined,
  MenuOutlined
} from "@ant-design/icons";
import json from '@core/constants/config.json'
// import support from '@core/assets/icons/support_agent.svg'
// import notification from '@core/assets/images/notifications.svg'

import './styles/navbar.scss'


import NavItems from './desktopMenu'



const BACK_URL = json.backUrl;

const { Header } = Layout
const { useBreakpoint } = Grid;

interface NavbarHeaderProps {
  onMenuClick?: () => void;
}

export default function NavbarHeader({
  onMenuClick,
}: NavbarHeaderProps) {
  const isLogin = !!localStorage.getItem("authToken")



  const screens = useBreakpoint();

  const isDesktop = screens.lg;

  const handleLogin = () => {
    (window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`)
  }
  return (
    <Header className="navbar-header">
      <Row >
        <Col span={24} style={{ width: "100%" }}>
          <nav className="navbar">
            {/* LEFT */}
            <div className="nav-left">
              {
                !isDesktop &&
                <Button
                  type="text"
                  icon={<MenuOutlined   style={{fontSize:"19px"}} />}
                  onClick={onMenuClick}
                 
                />
                // <NavLink to="/support">
                //   <div style={{display:"flex",alignItems:"self-start"}}>
                //     <Image src={support} preview={false} width={30} style={{ marginBottom: "10px", width: "22px" }} />
                //     <span style={{color:"#FF0000"}}> پشتیبانی</span>
                //   </div>
                // </NavLink>
              }



              {/* Desktop Menu */}
              <ul className="nav-menu desktop-only">
                <NavItems />

              </ul>

            </div>

            {
              !isLogin &&
              < div
                className="login-icon"
                onClick={handleLogin}
              >
                <span style={{ color: "red" }}>ورود</span>
                <LoginOutlined style={{ color: "red" }} />
              </div>

            }

          </nav>
          {/* Mobile Drawer */}



        </Col>
      </Row>

    </Header >
  )
}



