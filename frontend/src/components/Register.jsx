import React, {useState, useContext} from "react"
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button, Callout, FormGroup, InputGroup} from "@blueprintjs/core";
import { UserContext } from "../context/UserContext";


function Register() {

  const [newUser, setUser] = useState({username:"", password:""});
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  function handleChange(event) {
    const {name, value} = event.target;
    setUser({...newUser, [name]:value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    const genericErrorMsg = "Something happened, try again later!";
    try {
      const response = await axios.post(process.env.REACT_APP_API_ENDPOINT+"users/register", newUser);
      // const response = await fetch("/users/register", {
      //   method: "POST",
      //   credentials: "include",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newUser),
      // });
      console.log(response)
      if (response.status!== 200) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!")
          } else if (response.status === 401) {
            setError("Invalid email and password combination.")
          } else if (response.status === 500) {
            //const data = await response.json();
            const data = response.data;
            if (data.message) setError(data.message || genericErrorMsg)
          } else {
            setError(genericErrorMsg)
          }
      } else {
          //const data = await response.json();
          const data = response.data;
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
          history.push(`/triprecords`);
      }
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      setError(genericErrorMsg);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              {error && <Callout intent="danger">{error}</Callout>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <FormGroup>
                  <InputGroup type="email" name="username" placeholder="Email as User Name" value={newUser.username} onChange={handleChange}/>
                </FormGroup>
                <FormGroup>
                  <InputGroup type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleChange}/>
                </FormGroup>
                <Button intent="primary" disabled={isSubmitting} fill type="submit" text={`${isSubmitting? "submitting...":"Register"}`}/>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
};

export default Register;
