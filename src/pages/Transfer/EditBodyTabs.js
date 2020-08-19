import {Button, Form, Table, Popconfirm, Select, Tabs, Input} from "antd";
import React from "react";

const initialPanes = [
    { key: "1" }
];

const {TextArea} = Input
const { TabPane } = Tabs;
class EditBodyTabs extends React.Component {
    newTabIndex = 0;
    count=1;

    state = {
        activeKey: initialPanes[0].key,
        panes: initialPanes,

    };


    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    //新增TabPane标签页
    add = () => {
        const { panes } = this.state;
        const activeKey = `入参${this.newTabIndex++}`;
        console.log("activeKey==="+JSON.stringify(activeKey))
        const newPanes = [...panes];
        newPanes.push({
            title: `用例${this.count++}`,
            content: <TextArea/>,
            key: activeKey
        });
        this.setState({
            panes: newPanes,
            activeKey
        });
    };

    //监听
    onChange = (activeKey) => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    remove = (targetKey) => {
        const { panes, activeKey ,count} = this.state;
        console.log("activeKey==="+JSON.stringify(activeKey))
        console.log("targetKey==="+JSON.stringify(targetKey))
        let newActiveKey = activeKey;
        let lastIndex;
        panes.forEach((pane, i) => {
            console.log("pane==="+JSON.stringify(pane))
            console.log("i==="+JSON.stringify(i))
            if (pane.key === targetKey) {
                lastIndex = i - 1;

            }
        });
        const newPanes = panes.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        this.count=this.count-1;
        this.setState({
            panes: newPanes,
            activeKey: newActiveKey
        });
    };
    render() {
        const { panes, activeKey } = this.state;
        return (

        <Tabs
            type="editable-card"
            onChange={this.onChange}
            activeKey={activeKey}
            onEdit={this.onEdit}
            style={{height:'200px'}}
        >
            {panes.map((pane) => (
                <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                    {pane.content}
                </TabPane>
            ))}
        </Tabs>
        );
    }
}

export default EditBodyTabs;