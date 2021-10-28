import React, {useState} from "react"
import { Card, Tab, Tabs } from "@blueprintjs/core";
import Login from "./Login";
import Register from "./Register";

function Home() {
const [currentTab, setCurrentTab] = useState("login");

  return (

    <Card elevation="1">
      <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id="login" title="Login" panel={<Login />} />
        <Tab id="register" title="Register" panel={<Register />} />
        <Tabs.Expander />
      </Tabs>
    </Card>

  )
};

export default Home;
