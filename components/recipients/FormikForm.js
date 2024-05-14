"use client"
import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { createOfframpAddress, getGeoInfo } from "@/backend/requests";
import * as is2 from "is2";
import { ToastContainer,toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useField, useFormikContext } from "formik";
import * as Yup from "yup";

// Schema for yup
const bankSpecificFieldValueBlacklist = [
  "4100118308942379",
  "4100118604310894",
  "5599002064902101",
];
const phoneBlacklist = ["972548951056"];

const validatePhoneBlacklist = (number) => {
  if (phoneBlacklist.includes(number.replace(/\D/g, ""))) {
    return false;
  }
  return true;
};

const validateBankSpecificFieldValueBlacklist = (number) => {
  if (bankSpecificFieldValueBlacklist.includes(number)) {
    return false;
  }
  return true;
};
const validateYooNumber = (cardNumber) => {
  var strFirstFour = cardNumber.substring(0, 4);
  return strFirstFour === "4100";
};
const validateCardNumber = (cardNumber) => {
  return is2.creditCardNumber(cardNumber.replace(/\s+/g, ""));
};

const buildValidationSchema = ({ bankSpecificFieldKey }) => {
  //countryCode CAN BE NULL or UNDEFNED!
  const bankSpecificFieldValueSchemaMap = {
    yooMoneyWalletNumber: Yup.string()
      .min(16, "*Too short")
      .max(16, "*Too long")
      .test(
        "test-number",
        "Invalid: YooMoney Wallet Number should start with 4100",
        (value) =>
          validateBankSpecificFieldValueBlacklist(value) &&
          validateYooNumber(value)
      )
      .required("* Required"),
    cardNumber: Yup.string()
      .test(
        "test-number",
        "Invalid",
        (value) =>
          validateCardNumber(value) &&
          validateBankSpecificFieldValueBlacklist(value)
      )
      .required("* Required"),
    phoneNumber: Yup.string().min(11, "*Too short").required("*Required"),
  };

  const bankSpecificFieldValueSchema =
    bankSpecificFieldValueSchemaMap[bankSpecificFieldKey];

  return Yup.object().shape({
    bankName: Yup.string()
      .test(
        "test-bank",
        "Error: please select bank",
        (value) => value != "defaultBank"
      )
      .required("*Bank is required"),
    firstName: Yup.string()
      .min(2, "*Too short")
      .max(100, "*Too long")
      .required("*First Name is required"),
    lastName: Yup.string()
      .min(2, "*Too short")
      .max(100, "*Too long")
      .required("*Last Name is required"),
    phoneNumber: Yup.string()
      .min(11, "*Too short")
      .test("test-number", "Invalid", (value) => validatePhoneBlacklist(value))
      .required("*Required"),
    bankSpecificFieldValue: bankSpecificFieldValueSchema,
  });
};
const FormikForm = ({handleBlur, handleChange,isSubmitting,payoutOptionTypeData, currency, bankBins, banks,lng }) => {
  const [locError, setLocError] = useState(false);
  

  const {payoutOptionTypeKey,payoutOptionTypeDescription,bankSpecificFieldKey,bankSpecificFieldDescription,bankNameStrategy} = payoutOptionTypeData
  const payoutOptionTypeDescriptionTranslated = payoutOptionTypeDescription[lng]
  const bankSpecificFieldDescriptionTranslated = bankSpecificFieldDescription[lng]
  const {strategy} = bankNameStrategy
  const bankNameFixedValue = bankNameStrategy.value
  const [askBankName,setAskBankName] = useState(strategy === 'ask')
  

  const t = (stri) => {
    return stri
  }
  const language = 'ru'


  const {
    values,
    touched,
    setFieldValue,errors
  } = useFormikContext();


  useEffect(()=>{
    if (strategy != 'binInferThenAsk') {
      return
    }
    if (!touched.bankSpecificFieldValue) {
      return
    }
    if (
      values.bankSpecificFieldValue.length > 5
    ) {

      const inferredBankName = inferBankFromBin({cardNumber:values.bankSpecificFieldValue,bankBins:bankBins})
      if (!!inferredBankName) {
        setFieldValue("bankName",inferredBankName);
        setAskBankName(false)
      } else {
        setAskBankName(true)
      }
    } else {
      setAskBankName(false)
    }
    
  },[values.bankSpecificFieldValue])
  // const {strategy,fixedValue} = bankNameStrategy//fixedValue can be null (fixed only at yoomoney)

  return (
   <div>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="firstName">

                      <Form.Control
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        placeholder={t("First Name")}
                        className={
                          touched.firstName && errors.firstName ? "error" : null
                        }
                      />
                      {touched.firstName && errors.firstName ? (
                        <div className="error-message">{errors.firstName}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="lastName">
                      {/* <Form.Label>
                      {language === "ru" ? "Фамилия" : "Last Name"}:
                    </Form.Label> */}
                      <Form.Control
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        placeholder={
                         t("Last Name")
                        }
                        className={
                          touched.lastName && errors.lastName ? "error" : null
                        }
                      />
                      {touched.lastName && errors.lastName ? (
                        <div className="error-message">{errors.lastName}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group
                  controlId="bankSpecificFieldValue"
                  className="mx-auto mt-2"
                >
                  
                  <Form.Control
                    type="text"
                    name="bankSpecificFieldValue"
                    value={values.bankSpecificFieldValue}
                    onChange={handleChange}
                    country={currency.slice(0, 2).toLowerCase()}
                    as={BankSpecificFieldValueInput}
                    required
                    language={language}
                    gotErrorFromAbove={errors.bankSpecificFieldValue}
                    bankSpecificFieldKey={bankSpecificFieldKey}
                    payoutOptionTypeDescriptionTranslated={payoutOptionTypeDescriptionTranslated}
                    bankSpecificFieldDescriptionTranslated={payoutOptionTypeData.bankSpecificFieldDescription[lng]}
                    className="border-0"
                  />
                </Form.Group>
                <div className="py-3 ">
                {askBankName && 
                <Form.Group controlId="bankName">
                <Form.Select
                  value={values.bankName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.bankName && errors.bankName ? "error" : null
                  }
                >
                  <option value={"defaultBank"} key={"defaultBank"}>
                    {lng === "ru" ? "Выберите банк" : "Choose bank"}
                  </option>
                  {banks
                    .map((bankName) => {
                      return (
                        <option value={bankName} key={bankName}>
                          {bankName}
                        </option>
                      );
                    })}
                </Form.Select>
                {touched.bankName && errors.bankName ? (
                  <div className="error-message">{errors.bankName}</div>
                ) : null}
              </Form.Group>
                }
  
  

                </div>

                <Form.Group
                  controlId="phoneNumber"
                  className="mx-auto mt-2"
                >
                  <Form.Label>
                   {t("Contact phone number")}

                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    as={CustomPhoneInputContactNumber}
                    required
                    language={language}
                    gotErrorFromAbove={errors.phoneNumber}
                    className="border-0"
                  />
                </Form.Group>

              
                {t("Please make sure that this contact number is reachable via WhatsApp, Telegram, or SMS. Otherwise, your funds could be lost")}
                <Button
                  className="w-100 my-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {t("Continue")}
                </Button>
    </div>
  );
};


const CustomPhoneInputContactNumber = ({
  onChange,
  country,
  value,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <PhoneInput
      {...props}
      {...field}
      value={field.value}
      onChange={(phoneNumber) => {
        helpers.setValue(phoneNumber);
      }}
      containerClass="w-100"
      inputClass="w-100"
      country={country}
      containerStyle={{ margin: "0px", padding: "0px" }}
      inputStyle={{ height: "25%" }}
      isValid={(value, country) => {
        return validatePhoneBlacklist(value) && !props.gotErrorFromAbove;
      }}
    />
  );
};

export default FormikForm;




const BankSpecificFieldValueInput = ({ onChange, country, value, ...props }) => {
  const {bankSpecificFieldKey,bankSpecificFieldDescriptionTranslated,payoutOptionTypeDescriptionTranslated} = props
  const [field, meta, helpers] = useField(props.name);
 
  if (bankSpecificFieldKey === 'phoneNumber') {
    return (
      <>
      {bankSpecificFieldDescriptionTranslated} {payoutOptionTypeDescriptionTranslated}
      <PhoneInput
        {...props}
        {...field}
        value={field.value}
        onChange={(phoneNumber) => {
          helpers.setValue(phoneNumber);
        }}
        onlyCountries={[country.toLowerCase()]}
        containerClass="w-100"
        inputClass="w-100"
        country={country}
        placeholder={bankSpecificFieldDescriptionTranslated}
        containerStyle={{ margin: "0px", padding: "0px" }}
        inputStyle={{ height: "25%" }}
        isValid={(value, country) => {
          return validatePhoneBlacklist(value) && !props.gotErrorFromAbove;
        }}
      />
      </>
      
    );
  } else {
    return (
      <> {bankSpecificFieldDescriptionTranslated}
      <input {...props} {...field}  className="border rounded py-2 w-100 px-3"/>
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
    </>
    )
  }
  
};
const inferBankFromBin = ({cardNumber, bankBins}) => {
    const thisBin = cardNumber.slice(0,6)

  const result = bankBins.find((el)=> el.binNumber === thisBin)
  if (!result) {
    return null
  }
  return result.bankName
}


