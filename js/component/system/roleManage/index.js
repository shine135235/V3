import React,{Component} from 'react';
import axios from 'axios';
import { Menu, Icon,Tree,message,Button, Modal} from 'antd';
import AddRole from './addRole';
import EditRole from './editRole';

const TreeNode = Tree.TreeNode;
const SubMenu = Menu.SubMenu;
const confirm=Modal.confirm;
export default class RoleManage extends Component{
    constructor(props){
        super(props)
        this.state = {
            openKeys: ['public'],
            selectKey:['4DD48590454811E8A4FB02004C4F4F32'],
            checkedKeys:[],
            powerData:[],
            publicRole:[],
            privateRole:[],
            roleid:'4DD48590454811E8A4FB02004C4F4F32',
            rolename:'思维分服务台',
            roleType:true,
            display:true
        };
    }
    componentDidMount(){
        this.getRoleData()
        this.getPowerData(this.state.roleid)
    }
    onSelect=(e) =>{
        this.setState({
            roleid:e.key,
            rolename:e.item.props.children,
            roleType:e.item.props.rt=='public'?true:false
        })
        console.log(e)
        this.getPowerData(e.key)
    }
    //获取用户权限
    getPowerData=(key) =>{
        axios.get('http://172.16.6.5:9090/sys/permission',{
            params:{
                roleid:key
            }
        }).then(res =>{
            this.setState({
                powerData:res.data.power,
                checkedKeys:res.data.hasPower===null?[]:res.data.hasPower
            })
        })
    }
    //获取角色列表
    getRoleData=() =>{
        axios.get('http://172.16.6.5:9090/sys/role/list').then(res =>{
            this.setState({
                publicRole:res.data.public,
                privateRole:res.data.private
            })
        })
    }
    openAdd=(e) =>{
        e.stopPropagation();
        console.log(e.target.id)
        this.setState({
            addRole: true
        })
        if(e.target.id!='public'){
            this.setState({
                roleType:false
            })
        }
        
    }
    closeAdd=() =>{
        this.setState({
            addRole: false,
            editRole:false
        })
    }
    editRole=() =>{
        this.setState({
            editRole:true
        })
    }
    deleteRole=() =>{
        const _this=this;
        confirm({
            title: '确定要删除该角色吗?',
            content: '角色删除后,将导致拥有该角色功能的成员功能无法正常使用!',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.delete(`http://172.16.6.5:9090/sys/role`,{
                    data:{
                      id:_this.state.roleid
                    }
                }).then(res =>{
                    if(res.data.success){
                        message.success('角色删除成功');
                        _this.getRoleData()
                    }else{
                        message.error(res.data.message)
                    }
                })
            }
          });
        
    }
    onCheck = (checkedKeys,v) => {
        let subKeys=[...checkedKeys];
          if(v.halfCheckedKeys.length>0){
              v.halfCheckedKeys.map(item =>(
                subKeys.push(item)
              ))
          }
        console.log(this.state.roleid)
        axios.post('http://172.16.6.5:9090/sys/permission',{
            permissionId:subKeys,
            roleId:this.state.roleid
        }).then(res =>{
            if(res.data.success){
                message.success('权限修改成功!');
                this.getPowerData(this.state.roleid);
            }else{
                message.error('权限修改失败,请重试!')
            }
        })
        this.setState({ checkedKeys });
      }
      renderTreeNodes = (data) => {
        return data.map((item,i) => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={i} {...item} />;
        });
      }
    render(){
       if(this.state.powerData.length>0){
        return (
            <div className='role-and-power'>
            <div className='page-title'>
            <span>　<Icon type='solution' style={{ fontSize: 22 }} /> 角色管理</span>
            <font>
             
            </font>
            </div>
            <div className='role-content'>
            <div className='department'>
            <div className='role-aide'><Button type="primary" onClick={this.editRole}>编辑角色</Button> <Button type="primary" onClick={this.deleteRole}>删除角色</Button></div>
            <Menu
                mode="inline"
                onSelect={this.onSelect}
                defaultOpenKeys={this.state.openKeys}
                defaultSelectedKeys={this.state.selectKey}
                onOpenChange={this.onOpenChange}
            >
                <SubMenu key="public" title={<span><Icon type="global" /><span>公有角色</span>　<Icon type="usergroup-add" id='public' onClick={(e)=>{this.openAdd(e)}} /></span>}>
                    {
                        this.state.publicRole.map(item =>(
                            <Menu.Item key={item.id} rt='public'>{item.name}</Menu.Item>
                        ))
                    }
                </SubMenu>
                <SubMenu key="private" title={<span><Icon type="skin" /><span>私有角色</span>　<Icon type="usergroup-add" id='private' onClick={(e)=>{this.openAdd(e)}} /></span>}>
                    {
                        this.state.privateRole.map(item =>(
                            <Menu.Item key={item.id}>{item.name}</Menu.Item>
                        ))
                    }
                </SubMenu>
            </Menu>
            </div>
            <div className='power-list'>
             <div className='power-group'>
                    <div className='power-list-item'>
                        <Tree
                        checkable
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        >
                            {this.renderTreeNodes(this.state.powerData)}
                        </Tree>
                    </div>
               </div>
              </div>
            
            </div>
            <AddRole show={this.state.addRole} hide={this.closeAdd} public={this.state.roleType} reloadData={this.getRoleData} />
            <EditRole show={this.state.editRole} hide={this.closeAdd} public={this.state.roleType} id={this.state.roleid} name={this.state.rolename} reloadData={this.getRoleData} />
            </div>
        )
       }else{
           return(
            <div className='role-and-power'>
            <br />            　　正在获取数据,如长时间无反应,请刷新后重试!
            </div>
           )
       }
        
    }
}