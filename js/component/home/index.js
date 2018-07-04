import React,{Component} from 'react';
import Menus from '../header';
import './home.less';
import Allin from './plugin'

class Home extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let v2IP = sessionStorage.getItem('v2IP').replace(/"/g,"");
        let v2UserName = sessionStorage.getItem('v2UserName');
        let v2Pwd = sessionStorage.getItem('v2Pwd');
        let src = v2IP+"/iitsp/index.html?token="+v2UserName+"&"+v2Pwd;
        return(
            <div className='wrap'>
                <Menus selectedKeys={'5109AE81528211E8A4FB02004C4F4F50'} />
                <Allin ifsrc={src} />
            </div>
        )
    }
}

export default Home;