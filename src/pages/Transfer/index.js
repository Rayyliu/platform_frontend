import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input,Empty, Form, Carousel, Descriptions, Tag, Modal, notification, Popconfirm, Icon,Switch
} from 'antd'
import ExportJsonExcel from "js-export-excel"
import {del, get, post} from "../../utils/ajax";
import './style.css'
import CreateTransferIndex from "./CreateTransferIndex";
import EditTransferModal from "./EditTransferModal";
import moment from 'moment'
import SynDataModal from "./SynDataModal";
import EditStickModal from "./EditStickModal";
import {isAuthenticated} from "../../utils/session";
import jwt_decode from "jwt-decode";

@Form.create()
class Index extends React.Component{
    state = {
        cases: [],
        casesLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        selectedRowKeys: [],
        transfer: {},
        isAddAndUpdate: false,
        isAdd: false,
        synDataModel: false,
        isShowStickModal: false
    };
    componentDidMount() {
        if (!this.state.isAddAndUpdate){
            this.getCaseExecuteRecord()
        }
    }
    getCaseExecuteRecord = async (pageNum = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            casesLoading: true,
        });
        const res = await get('/single/case/queryPage', {
            pageNum: pageNum,
            pageSize: this.state.pagination.pageSize,
            caseName: fields.caseName || ''
        });

        console.log("pageres==="+JSON.stringify(res))
        if (res.code !== 0) {
            this.setState({
                casesLoading: false,
            });
            return
        }
        this.setState({
            casesLoading: false,
            cases: res.data.entity,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: pageNum
            }
        })
    };

    executeCase=async(values)=>{
        console.log("Transfer调试values==="+JSON.stringify(values))
        let cook =isAuthenticated();
        var user = jwt_decode(cook)
        console.log("cook==="+JSON.stringify(cook))
        var email = JSON.stringify(user.sub)
        const res = await post('/single/case/execute', {
            ...values,
            lastExecuteUser:email,
            add:false,
            valid:true
        });
        console.log("res==="+JSON.stringify(res))
        if (res.code === 0) {
            this.setState({
                result: {
                    success: res.success,
                    errorCode: res.errorCode,
                    execute: res.execute,
                    message: res.message,
                }
            }
            )
            this.props.transferList();
        }
    }
    /**
     * table分页
     */
    onTableChange = async (pageNum) => {
        await this.setState({
            pagination: pageNum
        });
        this.getCaseExecuteRecord(pageNum.current)
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getCaseExecuteRecord()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getCaseExecuteRecord();
        this.setState({
            selectedRowKeys: []
        });
        message.success('重置成功')
    };
    /**
     * 显示发布信息
     * */
    transferList = ()=>{
       this.setState({
           isAddAndUpdate: false,
           isAdd: false
       });
        this.getCaseExecuteRecord();
    };
    /**
     * 新增发布信息页面
     * */
    pushTransferInfo = () =>{
        this.setState({
            isAddAndUpdate: true,
            isAdd: true
        })
    };
    /**
     * 编辑发布信息页面
     * */
    editTransferInfo = (record)=>{
        this.setState({
            isAddAndUpdate: true,
            isAdd: false,
            transfer: record
        })
    };
    /**
     * 编辑置顶时间
     * */
    editStick = (record) =>{
        this.setState({
            isShowStickModal: true,
            transfer: record
        })
    };
    /**
     * 关闭编辑置顶框
     * */
    closeEditStickModal = () => {
        this.setState({
            isShowStickModal: false
        });
        this.getCaseExecuteRecord()
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/cases', {
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
                    this.getCaseExecuteRecord()
                }
            }
        })
    };
    /**
     * 同步数据
     * */
    synData = () =>{
        this.setState({
            synDataModel: true
        })
    };
    /**
     * 关闭修改模态框
     */
    closeSynDataModal = () => {
        this.setState({
            synDataModel: false
        });
        this.setState({
            selectedRowKeys: []
        });
        this.getCaseExecuteRecord()
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del('/cases',{
            ids: record.id
        });
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getCaseExecuteRecord()
        }
    };
    handleExport = async () => {
        const fields = this.props.form.getFieldsValue();
        const res = await get('/cases/findAll', {
            search: fields.search || ''
        });
        if (res.code !== 0){
            message.error(res.msg);
            return;
        }
        const excelCases = res.data;
        const option = {};
        const columns = [
            {
                title: '用例名称',
                dataIndex: 'caseName',
            },
            {
                title: '所属项目',
                dataIndex: 'project',
            },
            {
                title: '是否有效',
                dataIndex: 'valid',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="有效" unCheckedChildren="无效" checked={record.valid}  />
                )
            },
            {
                title: '描述',
                dataIndex: 'description',
            },
            {
                title: '执行结果',
                dataIndex: 'caseExecuteResult',
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
        option.fileName = 'cases';
        option.datas = [
            {
                sheetData: excelCases.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        switch (c.dataIndex) {
                            default:
                                result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'cases',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => excelCases.length),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };
    render() {
        const {isAddAndUpdate,isAdd} = this.state;
        const {cases,transfer,casesLoading, pagination,selectedRowKeys,synDataModel,isShowStickModal} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '用例名称',
                dataIndex: 'caseName',
                align: 'center',
            },
            {
                title: '所属项目',
                dataIndex: 'project',
                align: 'center',
            },
            {
                title: '用例描述',
                dataIndex: 'description',
                align: 'center',
            },
            {
                title: '是否有效',
                dataIndex: 'valid',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="有效" unCheckedChildren="无效" checked={record.valid}  />
                )
            },
            {
                title: '执行结果',
                dataIndex: 'caseExecuteResult',
                align: 'center'
            },
            {
                title: '上一次执行时间',
                dataIndex: 'lastExecuteTime',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '25%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.editTransferInfo(record)}>编辑</Button>
                        &emsp;
                        <Button type="primary" onClick={() => this.executeCase(record)}>运行</Button>
                        &emsp;
                        <Button type="default" onClick={() => this.editStick(record)}>用例详情</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };
        return isAddAndUpdate ?
            isAdd ?
                <CreateTransferIndex transferList = {this.transferList}/>
                :
                <EditTransferModal transferList ={this.transferList} transfer={transfer}/>
            :
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="综合搜索">
                                {getFieldDecorator('search')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="综合搜索"
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
                        <Button type='primary' icon='plus' onClick={this.pushTransferInfo}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>&emsp;
                        <Button type='default' icon='copy' disabled={!selectedRowKeys.length} onClick={this.synData}>同步数据</Button>&emsp;
                        <Button type="primary" icon='export' onClick={this.handleExport}>导出</Button>
                    </div>
                    <Table
                        rowKey='id'
                        bordered
                        expandedRowRender={record =>
                            <div>
                                <Descriptions
                                    bordered
                                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                >
                                    <Descriptions.Item label="关联接口"><Tag color="cyan">{record.interfaceId ? record.interfaceId:'用例关联接口'}</Tag></Descriptions.Item>
                                    <Descriptions label="测试数据">{record.body}</Descriptions>
                                    <Descriptions.Item label="发布人头像">
                                        {
                                            record.avatar?
                                                <img style={{height:'50px',width:'50px'}} src={record.response} alt={''}/>
                                                :
                                                <Tag color="cyan">平台发布</Tag>
                                        }
                                    </Descriptions.Item>
                                    <Descriptions label="接口返回实际结果">{record.response}</Descriptions>
                                    <Descriptions.Item label="城市"><Tag color="cyan">{record.city}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="街道"><Tag color="cyan">{record.district}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="地址"><Tag color="cyan">{record.address}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="是否置顶"><Tag color="cyan">{record.isStick ? '已置顶':'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="置顶天数"><Tag color="cyan">{record.isStick ? record.order ? record.order.stickDay:'平台赠送' :'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="置顶到期时间"><Tag color="cyan">{record.isStick ? moment(record.stickEndTime).format('YYYY-MM-DD HH:mm:ss'):'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="是否推广"><Tag color="cyan">{record.isGeneralize ? '已推广':'未推广'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="推广结束时间"><Tag color="cyan">{record.isGeneralize ? moment(record.generalizeEndTime).format('YYYY-MM-DD HH:mm:ss'):'未推广'}</Tag></Descriptions.Item>
                                    {/*<Descriptions.Item label="是否缴费"><Tag color="cyan">{record.isChargePublish ? '已缴费':'未缴费'}</Tag></Descriptions.Item>*/}
                                    <Descriptions.Item label="联系人"><Tag color="cyan">{record.linkman}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="联系电话"><Tag color="cyan">{record.phone}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="发布时间"><Tag color="cyan">{moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="描述">{record.description}</Descriptions.Item>

                                </Descriptions>
                            </div>
                        }
                        columns={columns}
                        dataSource={cases}
                        loading={casesLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditStickModal onCancel={this.closeEditStickModal} visible={isShowStickModal}  transfer={transfer}/>
                <SynDataModal onCancel={this.closeSynDataModal} visible={synDataModel}  ids={this.state.selectedRowKeys}/>
            </div>
    }
}

export default Index;
