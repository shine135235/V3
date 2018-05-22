import React,{Component} from 'react';
import Menus from '../header'

class Home extends Component{
 
    render(){
        return(
            <div className='wrap'>
            <Menus selectedKeys={'5109AE81528211E8A4FB02004C4F4F50'} />
            <div className='content'>
                首页
            </div>
            </div>
        )
    }
}

export default Home;