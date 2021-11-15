import React, {useState, useContext} from "react"
import { Button, Callout, FormGroup, InputGroup} from "@blueprintjs/core";
import { UserContext } from "../context/UserContext"


function Login() {
  const [user, setUser] = useState({username:"", password:""});
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  //let history = useHistory();

  function handleChange(event) {
    setUser({...user, [event.target.name]:event.target.value});
  }

  // function handleClick() {
  //   history.push(`/triprecords/${user.username}`);
  // }

  //Login handler
  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMsg = "Something went wrong. Please try again later.";
    //console.log(process.env.REACT_APP_API_ENDPOINT);
    fetch(process.env.REACT_APP_API_ENDPOINT+"users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    .then(async (res) => {
      setIsSubmitting(false);
      if (!res.ok) {
        if (res.status === 400) {
          setError("Please fill al the fields correctly");
        } else if (res.status === 401) {
          setError("Invalid email and password");
        } else {
          setError(genericErrorMsg);
        }
      } else {
          const data = await res.json()
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token, details: data }
          })
          // history.push(`/triprecords/${user.username}`);
          //history.push("/triprecords");
      }
    })
    .catch(error => {
      setIsSubmitting(false);
      setError(error);
    })

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
              <InputGroup type="email" name="username" placeholder="User Name" value={user.username} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <InputGroup type="text" name="password" placeholder="password" value={user.password} onChange={handleChange}/>
            </FormGroup>
            <Button intent="primary" disabled={isSubmitting} fill type="submit" text={`${isSubmitting? "submitting...":"Login"}`}/>
          </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login;
