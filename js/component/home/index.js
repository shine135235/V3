import React,{Component} from 'react';
import Menus from '../header'

class Home extends Component{
 
    render(){
        // let v2Token = sessionStorage.getItem('v2Token').replace(/"/g,"");
        let v2IP = sessionStorage.getItem('v2IP').replace(/"/g,"");
        let v2UserName = sessionStorage.getItem('v2UserName');
        let v2Pwd = sessionStorage.getItem('v2Pwd');
        // let v2Title = sessionStorage.getItem('v2Title');
        // let CURRENT_ROLENAME = sessionStorage.getItem('CURRENT_ROLENAME').replace(/"/g,"");
        // let GROUP_ID = sessionStorage.getItem('GROUP_ID').replace(/"/g,"");
        // let GROUP_NAME = sessionStorage.getItem('GROUP_NAME').replace(/"/g,"");
        // let USERNAME = sessionStorage.getItem('USERNAME').replace(/"/g,"");
        // let USER_ID = sessionStorage.getItem('USER_ID').replace(/"/g,"");
        // let PERMISSIONS = sessionStorage.getItem('PERMISSIONS');
        // let refreshTime = sessionStorage.getItem('refreshTime').replace(/"/g,"");
        // eslint-disable-next-line
        // console.log("v2Token",v2Token);
        // let src = v2IP+"/iitsp/index.html?token="+v2Token+"&"+v2Title+"&&"+CURRENT_ROLENAME+"&&&"+GROUP_ID+"&&&&"+GROUP_NAME+"&&&&&"+USERNAME+"&&&&&&"+USER_ID+"&&&&&&&"+PERMISSIONS+"&&&&&&&&"+refreshTime;
        //  let src = v2IP+"/iitsp/index.html?token="+v2Token+"&"+v2Title+"&&"+CURRENT_ROLENAME+"&&&"+GROUP_ID+"&&&&"+GROUP_NAME+"&&&&&"+USERNAME+"&&&&&&"+USER_ID+"&&&&&&&&"+refreshTime;
         let src = v2IP+"/iitsp/index.html?token="+v2UserName+"&"+v2Pwd;
        
        // eslint-disable-next-line
        console.log("src",src);
        return(
            <div className='wrap'>
                <Menus selectedKeys={'5109AE81528211E8A4FB02004C4F4F50'} />
                
                <iframe src={src} style={{"display":"none"}}></iframe>
            <div className='content'>
                首页
            </div>
            </div>
        )
    }
}

export default Home;