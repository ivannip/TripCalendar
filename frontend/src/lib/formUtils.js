export const UPDATE_FORM = "UPDATE_FORM";

function onInputChange(name, value, dispatch, formState) {
  const {hasError, errMsg} = validateInput(name, value);
  let isFormValid = true;

  //loop the whole form
  for (const key in formState) {
    const item = formState[key]
    // Check if the current field has error
    if (key === name && hasError) {
      isFormValid = false
      break
    } else if (key !== name && item.hasError) {
      // Check if any other field has error
      isFormValid = false
      break
    }
  }
  dispatch({
    type: UPDATE_FORM,
    data: {name, value, hasError, errMsg, touched: false, isFormValid,},
  })
}

function validateInput(name, value) {
  let hasError = false,
      errMsg = "";
  switch (name) {
    case "name":
      if (value.trim() === "") {
        hasError = true;
        errMsg = "Name cannot be empty.";
      } else if (!/^[a-zA-Z ]+$/.test(value)) {
        hasError = true;
        errMsg = "Invalid Name with special characters";
      } else {
        hasError = false;
        errMsg="";
      }
      break;
    case ("username"):
      if (value.trim() === "") {
        hasError = true;
        errMsg = "Username cannot be empty.";
      } else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value)) {
        hasError = true;
        errMsg = "Invalid Email with special characters";
      } else {
        hasError = false;
        errMsg="";
      }
      break;
    case ("password"):
      if (value.trim() === "") {
        hasError = true;
        errMsg = "Password cannot be empty.";
      } else if (value.trim().length < 8) {
        hasError = true;
        errMsg = "Password must have at least 8 charcters";
      } else {
        hasError = false;
        errMsg = "";
      }
      break;
    case "mobile":
      if (value.trim() === "") {
        hasError = true;
        errMsg = "Mobile cannot be empty.";
      } else if (!/^[0-9]{10}$/.test(value)) {
        hasError = true;
        errMsg = "Invalid Mobile Number. Use 10 digit only";
      } else {
        hasError = false;
        errMsg = "";
      }
      break;

    default:
      break
  }
  return { hasError, errMsg}
}

function onFocusOut(name, value, dispatch, formState) {
  const { hasError, errMsg } = validateInput(name, value)
  let isFormValid = true
  for (const key in formState) {
    const item = formState[key]
    if (key === name && hasError) {
      isFormValid = false
      break
    } else if (key !== name && item.hasError) {
      isFormValid = false
      break
    }
  }

  dispatch({
    type: UPDATE_FORM,
    data: { name, value, hasError, errMsg, touched: true, isFormValid },
  })
}

export {onInputChange, validateInput, onFocusOut};
