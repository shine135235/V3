import React,{Component} from 'react'
import './index.less'

export default class ComplaintManage extends Component{
    render(){
        let v2Ip = sessionStorage.getItem('v2IP').replace(/"/g,"");
        return(
            <div className='complaintManage'>
            <div className='complaintManage_iframe'>
            <iframe src={`${v2Ip}/iitsp/index.html#/operationManage/operationManagePage?ComplaintManagement`} frameBorder='none' style={{"width":"100%","height":"109%"}}></iframe>
            </div>
            </div>
        )
    }
}
