import React from 'react';
import { Tabs, Tab, TabPanel, TabList } from "@AndevisReactBundle/UI/Components/Tabs/Tabs";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class ExampleTabs extends ExampleBaseView {

    static bundleName = 'React';

    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Tabs example</h1>
                </div>

                <h3>Simple tabs</h3>
                <Tabs name="tabSet1">
                    <TabList>
                        <Tab>Title 1</Tab>
                        <Tab>Title 2</Tab>
                    </TabList>

                    <TabPanel>
                        <p>Any content 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Any content 2</p>
                    </TabPanel>
                </Tabs>

                <h3>How catch selected tab on backend</h3>
                <Tabs name="tabSet2">
                    <TabList>
                        <Tab>Title 1</Tab>
                        <Tab>Title 2</Tab>
                    </TabList>

                    <TabPanel>
                        <p>Any content 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Any content 2</p>
                    </TabPanel>
                </Tabs>
                <pre>
                    {JSON.stringify(this.state, null, 4)}
                </pre>

            </div>
        )
    }
}
