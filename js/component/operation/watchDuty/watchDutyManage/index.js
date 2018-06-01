import React,{Component} from 'react'
import './index.less'

export default class WatchDutyManage extends Component{
    render(){
        let v2Ip = sessionStorage.getItem('v2IP').replace(/"/g,"");
        return(
            <div className='watchDutyManage'>
            <div className='watchDutyManage_iframe'>
            <iframe src={`${v2Ip}/iitsp/index.html#/operationManage/operationManagePage?WatchDutyManageMent`} frameBorder='none' style={{"width":"100%","height":"109%"}}></iframe>
            </div>
            </div>
        )
    }
}
