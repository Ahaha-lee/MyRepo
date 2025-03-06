import useSession from '../Common/useSession';
import {Link} from 'react-router-dom';
import React from 'react';
export default function HeaderNav(){
    var name
     const {getSession}=useSession();
     if(getSession()){
      name=getSession().name
     }
return(

    <nav className="navbar navbar-expand-lg">
        <div className="container-fluid  bg-success p-3" style={{ backgroundColor: '#41855a' } }>
        <span className="navbar-brand mb-0 h1">顶呱呱</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to='/login' className="nav-link active" aria-current="page">登录</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/register' className="nav-link active" aria-current="page">注册</Link>
                        </li>
                    </ul>
                </div>
        </div>
    </nav> 
    );
}
