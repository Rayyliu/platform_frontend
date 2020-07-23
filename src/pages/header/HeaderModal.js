import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select, Radio, Button,Table} from 'antd'
import {get, post} from '../../utils/ajax'
import CreateHeaderModal from "./CreateHeaderModal";

@Form.create()
class HeaderModal extends Component {

    state = {
        dataSource :[],
        isShowCreateModal:false
    }

    componentDidMount() {
        this.queryProject();
    }
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createTrade(values)
            }
        })
    };

    toggleShowCreateModal=(visible)=>{
        this.setState({
            isShowCreateModal:visible
        })
    }



    /***
     * 去重查询项目名称
     */
    queryProject = async () =>{
        const res = await get('/project/queryDistProject')
        if(res.code === 0) {
            this.setState({
                projects:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
        }
    }



    createTrade = async (values) => {
        const res = await post('/env/add', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };
    render() {
        const {dataSource,isShowCreateModal} = this.state;
        const {projects} = this.state;
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        const columns = [
           {
            title: '参数名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '值',
            dataIndex: 'value',
            key: 'value',
        }];
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='添加header'
                centered
                onOk={this.handleOk}
            >
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type='primary' icon='plus-square' onClick={()=>this.toggleShowCreateModal(true)}>添加</Button>
                </div>
                <Table dataSource={dataSource} columns={columns}></Table>
                <CreateHeaderModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal}/>
            </Modal>
        );
    }
}

export default HeaderModal;
