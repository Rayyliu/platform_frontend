import EditableCell from "./EditableCell";
import {Button, Form,Table,Popconfirm,Select} from "antd";
import React from "react";
import { EditableContext } from './CreateContext';


const {Option} =Select
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "参数",
                dataIndex: "parameter",
                width: "30%",
                editable: true
            },
            {
                title: "期望值",
                dataIndex: "except",
                editable: true
            },
            {
                title: "校验规则",
                dataIndex: "rule",
                render:() =>
                    this.state.dataSource.length >= 1 ?(
                        <Select onChange={this.handleChange}>
                            <Option value={"equal"}>equal</Option>
                            <Option value={"notEqual"}>notEqual</Option>
                            <Option value={"contains"}>contains</Option>
                            <Option value={"notContains"}>notContains</Option>
                        </Select>
                    ):null
            },
            {
                title: "operation",
                dataIndex: "operation",
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null
            }
        ];

        this.state = {
            dataSource: [
                {
                    key: "0",
                    parameter: "success",
                    except: "32",
                    rule: "Equals"
                },
                {
                    key: "1",
                    parameter: "executed",
                    except: "true",
                    rule: "Equals"
                }
            ],
            count: 0
        };
    }


    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key)
        });
    };

    handleAdd = () => {
        console.log("进入add方法");
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            // name: `Edward King ${count}`,
            parameter: '',
            except: '',
            rule:this.columns.rule,
        };
        console.log("Edit---newData==="+JSON.stringify(newData))
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        console.log("newData=="+JSON.stringify(newData))
        this.setState({ dataSource: newData });
    };



    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave
                })
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{ marginBottom: 16 }}
                >
                    Add a row
                </Button>
                {/*<Button onClick={this.props.submit}>确认</Button>*/}
                <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

export default EditableTable;