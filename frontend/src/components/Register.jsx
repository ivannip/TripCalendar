import React, {useState, useContext, useReducer} from "react"
import { Button, Callout, FormGroup, InputGroup} from "@blueprintjs/core";
import { UserContext } from "../context/UserContext";
import {UPDATE_FORM, onInputChange, validateInput, onFocusOut} from "../lib/formUtils";

//initial state of form
const initialState = {
  username: {value: "", touched: false, hasError: true, errMsg: ""},
  password: {value: "", touched: false, hasError: true, errMsg: ""},
  name: {value: "", touched: false, hasError: true, errMsg: ""},
  mobile: {value: "", touched: false, hasError: true, errMsg: ""}
};

//formsReducer to update state
function formReducer(state, action) {
  switch (action.type) {
    case UPDATE_FORM:
      const {name, value, hasError, errMsg, touched, isFormValid} = action.data;
      return {
        ...state,
        [name]: {...state[name], value, hasError, errMsg, touched},
        isFormValid,
      }
    default:
      return state;
  }
}

function Register() {

  //const [newUser, setUser] = useState({username:"", password:""});
  const [userContext, setUserContext] = useContext(UserContext);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");


  function handleChange(event) {
    const {name, value} = event.target;
    // setUser({...newUser, [name]:value});
    onInputChange(name, value, dispatch, formState);
  }

  function handleBlur(event) {
    const {name, value} = event.target;
    onFocusOut(name, value, dispatch, formState);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let isFormValid = true;
    for (const name in formState) {
      const item = formState[name];
      const { value } = item;
      const { hasError, errMsg } = validateInput(name, value);
      if (hasError) {
        isFormValid = false;
      }
      if (name) {
        dispatch({type: UPDATE_FORM, data: {name, value, hasError, errMsg, touched: true, isFormValid,},})
      }
    }
    if (!isFormValid) {
      setShowError(true);
    } else {
      registerUser({username: formState.username.value, password: formState.password.value, name: formState.name.value, mobile: formState.mobile.value});
    }

    // Hide the error message after 5 seconds
    setTimeout(() => {
      setShowError(false)
    }, 5000)

  }

  function registerUser(newUser) {
    //event.preventDefault();
    setIsSubmitting(true);
    setError("");
    const genericErrorMsg = "Something happened, try again later!";
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!")
          } else if (response.status === 401) {
            setError("Invalid email and password combination.")
          } else if (response.status === 500) {
            console.log(response)
            const data = await response.json()
            if (data.message) setError(data.message || genericErrorMsg)
          } else {
            setError(genericErrorMsg)
          }
        } else {
          const data = await response.json()
          console.log(data);
          console.log(userContext);
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token, details: data}
          })

          console.log("Register");
          console.log(userContext);
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMsg)
      })
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              {error && <Callout intent="danger">{error}</Callout>}
              {showError && !formState.isFormValid && (
                <Callout intent="danger">Please fill all the fields correctly</Callout>
              )}
              <form className="auth-form" onSubmit={handleSubmit}>
                <FormGroup>
                  <InputGroup type="email" name="username" placeholder="Email as User Name" value={formState.username.value} onChange={handleChange} onBlur={handleBlur}/>
                  { formState.username.touched && formState.username.hasError && (
                      <div className="error">{formState.username.errMsg}</div>
                  )}
                </FormGroup>
                <FormGroup>
                  <InputGroup type="password" name="password" placeholder="Password" value={formState.password.value} onChange={handleChange} onBlur={handleBlur}/>
                  { formState.password.touched && formState.password.hasError && (
                      <div className="error">{formState.password.errMsg}</div>
                  )}
                </FormGroup>
                <FormGroup>
                  <InputGroup type="text" name="name" placeholder="Your full name"  value={formState.name.value} onChange={handleChange} onBlur={handleBlur}/>
                  { formState.name.touched && formState.name.hasError && (
                      <div className="error">{formState.name.errMsg}</div>
                  )}
                </FormGroup>
                <FormGroup>
                  <InputGroup type="text" name="mobile" placeholder="Your mobile"  value={formState.mobile.value} onChange={handleChange} onBlur={handleBlur}/>
                  { formState.mobile.touched && formState.mobile.hasError && (
                      <div className="error">{formState.mobile.errMsg}</div>
                  )}
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
