import { useEffect, useState } from "react";
import { IS_EMAIL, IS_PHONE } from "./const";

export const useInput = (intialValue, validations) => {
    const [value, setValue] = useState(intialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);

    const onChange = (e) => {
        setValue(e?.target?.value || '');
    }

    const onSelect = (e) => {
        setValue(e?.map(item => {return item.id}) || []);
    }

    const onRemove = (e) => {
        setValue(e.map(item => {return item.id}));
    }

    const saveImg = (e) => {
        setValue(e?.target?.files[0] || null);
    }

    const onBlur = (e) => {
        setDirty(true);
    }

    return {
        value,
        onChange,
        onSelect,
        onRemove,
        onBlur,
        saveImg,
        isDirty,
        ...valid
    }
}

const useValidation = (value, validations) => {
    const [minLengthError, setMinLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordSecurityError, setPasswordSecurityError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [multiSelectError, setMultiSelectError] = useState(false);
    const [isNumberError, setIsNumberError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [isRoleError, setIsRoleError] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch(validation) {
                case 'minLength':
                    value.length < validations[validation].value ? setMinLengthError(true) : setMinLengthError(false); 
                    setMessageError(`The '${validations[validation].name}' field can't to empty and less than ${validations[validation].value} characters.`);
                    break;
                case 'isEmail':
                    IS_EMAIL.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
                    setMessageError(`The 'email' field can't to empty or Incorrect email.`);
                    break;
                case 'isPhone':
                    IS_PHONE.test(value) ? setPhoneError(false) : setPhoneError(true);
                    setMessageError(`The 'Phone' field can't to empty or Incorrect phone number.`);
                    break;
                case 'isPasswordSecurity':
                    const rePasswordSecurity = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
                    rePasswordSecurity.test(value) ? setPasswordSecurityError(false) : setPasswordSecurityError(true);
                    break;
                case 'isConfirmPassword':
                    value === validations[validation].value ? setConfirmPasswordError(false) : setConfirmPasswordError(true);
                    setMessageError(`The password doesn't match.`);
                    break;
                case 'multiSelect':
                    value.length < 1 ? setMultiSelectError(true) : setMultiSelectError(false);
                    setMessageError(`The '${validations[validation].name}' field can't to empty.`);
                    break;
                case 'isNumberId':
                    Number(value) < 1 ? setIsNumberError(true) : setIsNumberError(false);
                    setMessageError(`The '${validations[validation].name}' field can't to empty.`);
                    break;
                case 'isPrice':
                    Number(value) < 1 ? setPriceError(true) : setPriceError(false);
                    setMessageError(`The '${validations[validation].name}' field can't be less than or equal to 0.`);
                    break;
                case 'isRole':
                    value === validations[validation] ? setIsRoleError(true) : setIsRoleError(false);
                    setMessageError(`You can't assign a role like yours`);
                    break;
                case 'isImg':
                    value === null ? setImgError(true) : setImgError(false);
                    setMessageError(`The '${validations[validation].name}' field can't to empty.`);
                    break;
                case 'age':
                    const now = new Date();
                    const date = new Date(value);
                    const age = now.getFullYear() - date.getFullYear();
                    (age > 90 || age < 12) ? setDateError(true) : setDateError(false);
                    setMessageError(`You are either too young or you are already retired!`)
                    break;
                default:
                    break;
            }
        }
    }, [validations, value])

    useEffect(() => {
        if (minLengthError || emailError || phoneError || 
            passwordSecurityError || confirmPasswordError || multiSelectError || 
            isNumberError || priceError || isRoleError || 
            imgError || dateError
            ) {
            setInputValid(false)
        } else {
            setInputValid(true)
        }
    }, [minLengthError, emailError, phoneError, passwordSecurityError, confirmPasswordError, multiSelectError, isNumberError, priceError, isRoleError, imgError, dateError])

    return {
        minLengthError,
        emailError,
        phoneError,
        passwordSecurityError,
        confirmPasswordError,
        multiSelectError,
        isNumberError,
        priceError,
        isRoleError,
        imgError,
        dateError,
        messageError,
        inputValid
    }
}