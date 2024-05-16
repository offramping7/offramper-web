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

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useField, useFormikContext } from "formik";
import * as Yup from "yup";


import Image from "next/image"
const phoneBlacklist = ["972548951056"];

const validatePhoneBlacklist = (number) => {
  if (phoneBlacklist.includes(number.replace(/\D/g, ""))) {
    return false;
  }
  return true;
};

const FormikForm = ({translationJson,handleBlur, handleChange,isSubmitting,payoutOptionTypeDescription,bankSpecificFieldKey,bankSpecificFieldDescription,bankNameStrategy, currency, bankBins, banks,lng }) => {
  const {strategy} = bankNameStrategy
  const [askBankName,setAskBankName] = useState(strategy === 'ask')
  const t = (str) => {
    return translationJson[str] || str
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

  return (
   <div className="container shadow rounded mx-1 px-3 py-3">
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
                  className="mx-auto mt-3 pt-3"
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
                    goerrorfromabove={errors.bankSpecificFieldValue}
                    bankSpecificFieldKey={bankSpecificFieldKey}
                    // payoutOptionTypeDescription={payoutOptionTypeDescription}
                    // bankSpecificFieldDescription={bankSpecificFieldDescription}
                    placeholder={capitalizeFirstLetter(bankSpecificFieldDescription)}
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
                    {t("Pick bank")}
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
                    goerrorfromabove={errors.phoneNumber}
                    className="border-0"
                    
                  />
                </Form.Group>

              <div className="text-center text-muted">
              {t("recipient.reachabilityWarning")}
              </div>
                
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
        return validatePhoneBlacklist(value) && !props.goerrorfromabove;
      }}
    />
  );
};

export default FormikForm;




const BankSpecificFieldValueInput = ({ onChange, country, value, ...props }) => {
  const {bankSpecificFieldKey} = props
  const [field, meta, helpers] = useField(props.name);
 
  if (bankSpecificFieldKey === 'phoneNumber') {
    return (
      <>
      <div className="text-muted mb-1 pb-1">
        {props.placeholder}
      </div>
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
        containerStyle={{ margin: "0px", padding: "0px" }}
        inputStyle={{ height: "25%" }}
        isValid={(value, country) => {
          return validatePhoneBlacklist(value) && !props.goerrorfromabove;
        }}
      />
      </>
      
    );
  } else {
    return (
      <> 
      
      <div className="row border rounded py-2 px-1 mx-1">
        <div className="col-1">
        <Image src="/images/icon/credit-card-svgrepo-com.svg" height={30} width={30} />
        </div>
              <div className="col-8">
              <input {...props} {...field}  className="border-0" />
     
      </div>
            </div>
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




function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}