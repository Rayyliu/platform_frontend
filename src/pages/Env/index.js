import React from "react";
import {tokenGetData, get, patch} from "../../utils/ajax";
import {
    Table,
    Card,
    Button,
    Icon,
    Modal,
    Popconfirm,
    notification,
    Switch, message, Col, Input, Form
} from 'antd'
import CreateTradeModal from "./CreateTradeModal";
import EditTradeModal from "./EditTradeModal";

@Form.create()
class Index extends React.Component{
    state = {
        trades: [],
        tradesLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        trade: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };
    componentDidMount() {
        this.getTrades()
    }
    getTrades = async (pageNum = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            tradesLoading: true,
        });
        const res = await tokenGetData('/env/queryPage', {
            pageNum: pageNum,
            pageSize: this.state.pagination.pageSize,
            envName: fields.envName || ''
        });
        if (res.code !== 0) {
            this.setState({
                tradesLoading: false,
            });
            return
        }
        this.setState({
            tradesLoading: false,
            // trades: res.data.entity,
            trades: res.data,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: pageNum
            }
        })
    };
    /**
     * table分页
     */
    onTableChange = async (pageNum) => {
        await this.setState({
            pagination: pageNum
        });
        this.getTrades(pageNum.current)
    };
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
                    this.getTrades()
                }
            }
        })
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await get('/env/singleDelet',{
            envId: record.id
        });
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getTrades()
        }
    };
    /**
     * 开关
     * */
    switch = async (record) =>{
        const res = await patch('/trades/'+record.id);
        if (res.code === 0) {
            notification.success({
                message: '修改成功',
                description: res.msg,
            });
            this.getTrades()
        }
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getTrades();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            trade: visible
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            trade: {}
        });
        this.getTrades()
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getTrades()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getTrades();
        this.setState({
            selectedRowKeys: []
        });
        message.success('重置成功')
    };
    render() {
        const { trades, tradesLoading, pagination, trade, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                width:'8%',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '测试环境',
                dataIndex: 'envName',
                align: 'center'
            },

            {
                title: 'url',
                dataIndex: 'url',
                align: 'center'
            },
            // {
            //     title: '端口号',
            //     dataIndex: 'port',
            //     align: 'center'
            // },
            {
                title: '所属项目',
                dataIndex: 'project',
                align: 'center'
            },
            {
                title: '环境描述',
                dataIndex: 'envDescription',
                align: 'center'
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
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="测试环境">
                                {getFieldDecorator('envName')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="测试环境"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={trades}
                        loading={tradesLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditTradeModal onCancel={this.closeEditModal} visible={isShowEditModal}  trade={trade}/>
                <CreateTradeModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }
}

export default Index;
