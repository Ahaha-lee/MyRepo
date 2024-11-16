
import useSession from '../../utils/useSession';
import {Link} from 'react-router-dom';

export function HeaderNav(){
    var name
     const {getSession}=useSession();
     if(getSession()){
      name=getSession().name
     }
return(
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">顶呱呱</a>
                    {name !='' ? (
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to='' className="nav-link active" aria-current="page">{name}</Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to='/login' className="nav-link active" aria-current="page">登录</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/register' className="nav-link active" aria-current="page">注册</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
