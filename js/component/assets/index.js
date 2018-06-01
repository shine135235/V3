import React,{Component} from 'react';
import Menus from '../header';
// import LeftMenu from '../submenu';


class Assets extends Component{
    state = { loading: false }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    componentDidMount(){
        this.setState({
            loading:false
        })
    }
    render(){
        
        let v2IP = sessionStorage.getItem('v2IP').replace(/"/g,"");
        // let PERMISSIONS = sessionStorage.getItem('PERMISSIONS').replace(/"/g,"");
        //esline-disable-next-line
        // console.log("V3PERMISSIONSPERMISSIONSPERMISSIONS",PERMISSIONS);
        let src = v2IP+"/iitsp/index.html#/assetManage/assetManagePage";
        return(
            <span>
            <Menus />
            {/* <LeftMenu {...this.props}></LeftMenu> */}
            
            <iframe src={src} frameBorder="none" style={{"width":"100%","height":"100%","marginTop":"-12px"}}></iframe>
            </span>
        )
    }
}

export default Assets;