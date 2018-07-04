import React,{Component} from 'react';
import axios from 'axios';
import config from '../../config';


console.log('------------->',sessionStorage.getItem('cid'))
let ajaxNum=0
let pageData=[];
export default class AuthPower extends Component{
    state={
        pagePower:[],
    }
    componentWillMount(){
        ajaxNum++
        if(ajaxNum<=1){
            axios.get(`${config.api_server}/sys/resource/opsresource`,{
                params:{
                    parentId:sessionStorage.getItem('cid'),
                    roleId:JSON.parse(sessionStorage.getItem('user')).lastUsedRole.id
                }
                }).then(res =>{
                    pageData=res.data
                    ajaxNum=0;
            })
            return false
        }
    }
    render(){
           if(pageData.length>0){
               if(pageData.find(item =>(
                item==this.props.children.props.god
               ))){
                return(
                    <span>
                        {this.props.children}
                    </span>
                )
               }else{
                   return(
                    <span></span>
                   )
               }
           }else{
            return(
                <span></span>
               )
           }
       
    }
}