import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form, Tag,Popconfirm,Icon,notification,Switch,
} from 'antd'
import moment from 'moment'
import ExportJsonExcel from "js-export-excel"
import {get,tokenGetData} from "../../utils/ajax";
import CreateInterFaceModal from "./CreateInterFaceModal";
import {Modal} from "antd/lib/index";
import EditInterFaceModal from "./EditInterFaceModal";

@Form.create()
class Interfaces extends React.Component{
    state = {
        interfaces: [],
        interfacesLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        interFace: {},
        isShowCreateModal: false,
        isShowEditModal:false,
        selectedRowKeys: []
    };
    componentDidMount() {
        this.getInterfaces()
    }
    getInterfaces = async (pageNum = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            interfacesLoading: true,
        });
        const res = await tokenGetData('/interface/queryPage', {
            pageNum: pageNum,
            pageSize: this.state.pagination.pageSize,
            // search: fields.search || ''
            interfaceName: fields.interfaceName || ''
        });
        console.log("entity==="+JSON.stringify(res.data.entity))
        if (res.code !== 0) {
            this.setState({
                interfacesLoading: false,
            });
            return
        }
        this.setState({
            interfacesLoading: false,
            interfaces: res.data,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: pageNum

            }

        })
        console.log("interfaces==="+JSON.stringify(this.interfaces))
    };


    expandedRowRender() {
        return <Table

        />
    }

    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await get('/env/deletes', {
                    ids: this.state.selectedRowKeys
                });
                if (res.code === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                    this.setState({
                        selectedRowKeys: []
                    });
                    this.getInterfaces()
                }
            }
        })
    };

    /**
     * 创建modal
     * */
    toggleShowCreateModal=(visible)=>{
        this.setState({
            isShowCreateModal: visible
        });
        this.getInterfaces()
}

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            interFace: {}
        });
        this.getInterfaces()
    };

    showEditModal=(visible)=>{
        console.log("visible==="+JSON.stringify(visible))
        this.setState({
            isShowEditModal:true,
            interFace:visible
        })
    }

    /**
     * table分页
     */
    onTableChange = async (pageNum) => {
        await this.setState({
            pagination: pageNum
        });
        this.getInterfaces(pageNum.current)
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getInterfaces()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getInterfaces();
        message.success('重置成功')
    };
    /**
     * 订单导出
     * */
    handleExport = () => {
        const { interfaces } = this.state;
        const option = {};
        const columns = [
            {
                title: '订单类型',
                dataIndex: 'orderType',
            },
            {
                title: '订单状态',
                dataIndex: 'interfacestatus',
            },
            {
                title: '订单金额(/元)',
                dataIndex: 'orderAmount',
            },
            {
                title: '置顶天数(/天)',
                dataIndex: 'stickDay',
            },
            {
                title: '支付时间',
                dataIndex: 'payedAt',
            },
            {
                title: '付款用户',
                dataIndex: 'nickname',
            }
            ];
        option.fileName = 'interfaces';
        option.datas = [
            {
                sheetData: interfaces.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        if (c.dataIndex === 'orderType'){
                            result[c.dataIndex] = item[c.dataIndex] ? '置顶':'推广';
                        }else if (c.dataIndex === 'interfaceStatus'){
                            result[c.dataIndex] = item[c.dataIndex] ? '支付成功':'等待支付';
                        } else if (c.dataIndex === 'payedAt'){
                            result[c.dataIndex] = moment(item[c.dataIndex]).format('YYYY-MM-DD HH:mm:ss');
                        } else{
                            result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'interfaces',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => 10),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };
    render() {
        const { interFace,selectedRowKeys,isShowCreateModal,interfaces,interfacesLoading, pagination,isShowEditModal} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                width:'8%',
                render :(text, record, index)=>{
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '接口名称',
                dataIndex: 'interfaceName',
                align: 'center',
                // render: (text) => {
                //     if (text === 1) {
                //         return <Tag color="#2db7f5">置顶</Tag>
                //     } else if (text === 0) {
                //         return <Tag color="#87d068">推广</Tag>
                //     }else if (text === 2){
                //         return <Tag color="#108ee9">发布缴费</Tag>
                //     }
                // }
            },
            {
                title: '接口路径',
                dataIndex: 'path',
                align: 'center',
                // render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
                // sorter: (a, b) => a.payedAt - b.payedAt
            },
            {
                title: '所属项目',
                dataIndex: 'project',
                align: 'center',
                // render: (text) => {if (text) {
                //     return <Tag color="#2db7f5">支付成功</Tag>
                // } else {
                //     return <Tag color="#87d068">等待支付</Tag>
                // }}
            },
            {
                title: '请求方式',
                dataIndex: 'method',
                align: 'center',
                // sorter: (a, b) => a.orderAmount - b.orderAmount
            },
            {
                title: '数据传输方式',
                dataIndex: 'mode',
                align: 'center',
                // sorter: (a, b) => a.stickDay - b.stickDay,
                // render: (text, record) =>{
                //     if (record.orderType === 1) {
                //         return text
                //     } else if (record.orderType === 0) {
                //         return <Tag color="#87d068">推广订单</Tag>
                //     }else if (record.orderType === 2){
                //         return <Tag color="#108ee9">发布缴费订单</Tag>
                //     }
                // }
            },
            {
                title: '是否签名',
                dataIndex:'sign',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="签名" unCheckedChildren="不签名" checked={record.sign}  />
                )
                // render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
                // sorter: (a, b) => a.payedAt - b.payedAt
            },
            {
                title: '签名属性',
                dataIndex: 'signAttribute',
                align: 'center',
            },
            {
                title: '描述',
                dataIndex: 'description',
                align: 'center',
            },
            {
                title: '签名字段',
                dataIndex: 'signEntity',
                align: 'center',
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: 'header',
                dataIndex: 'header',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="设置" unCheckedChildren="不设置" checked={record.header}  />
                )
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: 'header详情',
                dataIndex: 'headerdetail',
                align: 'center',
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: '是否mock',
                dataIndex: 'mock',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="有" unCheckedChildren="无" checked={record.mock}  />
                )
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: '更新时间',
                dataIndex: 'updateAt',
                align: 'center',
                // sorter: (a, b) => a.orderAmount - b.orderAmount,
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: '更新用户',
                dataIndex: 'lastUpdateUser',
                align: 'center',
                // render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '20%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },

        ];
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="接口搜索">
                                {getFieldDecorator('interfaceName')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="接口名称"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={()=>this.toggleShowCreateModal(true)}>新增</Button>
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    {/*<div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon='export' onClick={this.handleExport}>导出</Button>
                    </div>*/}
                    <Table
                        style={{marginTop: '50px'}}
                        rowKey='interfaceNo'
                        bordered
                        // mountNode
                        // expandedRowRender={this.expandedRowRender}
                        columns={columns}
                        dataSource={interfaces}
                        loading={interfacesLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                        scroll={{ x: 2600}}
                        rowSelection={rowSelection}
                    />
                </Card>
                <CreateInterFaceModal visible ={isShowCreateModal} toggleVisible={this.toggleShowCreateModal}/>
                <EditInterFaceModal getInterfaces={this.getInterfaces} visible ={isShowEditModal} onCancel={this.closeEditModal} interFace={interFace}/>
            </div>
        )
    }
}

export default Interfaces;
