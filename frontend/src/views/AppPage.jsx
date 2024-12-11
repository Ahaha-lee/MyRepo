import HeaderNav from '../utils/HeaderNav';
import React from 'react';
import { getLocalStorage } from '../components/localstorage';

export default function AppPage(){
    const name=getLocalStorage('session',true).name;
    return(
        <>
        {name =='' &&<HeaderNav /> }
        <div>
            区别于各个模式下的总首页
        </div>
        </>
     
    );
}