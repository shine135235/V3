import React,{Component} from 'react';
import RoleAndCompany from './roleAndCompany'

import './index.less'

export default class UserManager extends Component{
    constructor(props){
        super(props);
        this.state={
            pid:"1",
            deptData:[]
        }
    }
    onChange  = (e) =>{
        this.setState({
            pid:e.target.value
        })
    }
    render(){
        return (
            <div className='role-and-power'>
                <RoleAndCompany pid={this.state.pid} />
            </div>
        )
    }
}

 