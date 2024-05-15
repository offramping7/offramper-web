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
import FormikForm from "./FormikForm"


// Schema for yup


const RecipientForm = ({ translationJson,payoutOptionTypeDescription,bankSpecificFieldKey,bankSpecificFieldDescription,bankNameStrategy, currency, bankBins, banks,lng }) => {
  const [locError, setLocError] = useState(false);
  
  const t = (str) => {
    return translationJson[str] || str
  }
  const generatedValidationSchema = buildValidationSchema({bankSpecificFieldKey})
  const bankNameFixedValue = bankNameStrategy?.value
  const {strategy} = bankNameStrategy
  

  

  const language = 'ru'

  const myInitialValues = {
    bankName: strategy === 'fixedValue' ? bankNameFixedValue : "defaultBank",
    firstName: "",
    lastName: "",
    bankSpecificFieldValue: "",
    phoneNumber: "",
  }


  useEffect(() => {
    getGeoInfo().then((countryCode) => {
      if (countryCode == "KZ") {
        setLocError(true);
      }
      if (
        countryCode == "IL" &&
        bankSpecificFieldKey == "yooMoneyWalletNumber"
      ) {
        setLocError(true);
      }
    });
  }, []);

  const submitHandler = (values) => {
    const addOfframpAddressPayload = {
      currency: currency,
      bankName: values.bankName,
      nickname: values.firstName + " " + values.lastName,
      phoneNumber: values.phoneNumber,
      bankSpecificFieldValue: values.bankSpecificFieldValue,
    };
        return createOfframpAddress(addOfframpAddressPayload).then((data) => {
      const { address, blockchain, cryptocurrency } = data;
      if (!!address && !!blockchain && !!cryptocurrency) {
        const backendRes = {
          address,
          blockchain,
          nickname: values.firstName + " " + values.lastName,
          cryptocurrency,
        };
        return backendRes;
      }
    });
  };
  const handleSubmitReturnedPostIframe = (backendRes) => {
    toast(language === "ru" ? "Успешно!" : "Success!");
    window.parent.postMessage(backendRes, "*");
  };

  return (
    <div className="mt-3">
      {locError === true ? (
        <h5 className="text-center text-muted px-1 my-5">
          {" "}
          Service Unavailable
        </h5>
      ) : (
        <Container className="border-0 rounded mt-2">
          <Formik
            initialValues={myInitialValues}
            validationSchema={generatedValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);

              submitHandler(values)
                .then((backendRes) =>
                  handleSubmitReturnedPostIframe(backendRes)
                )
                .then(() => {
                  resetForm();
                  setSubmitting(false);
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit} className="mx-auto">

             <FormikForm translationJson={translationJson} currency={currency} handleBlur={handleBlur} handleChange={handleChange} isSubmitting={isSubmitting}  
             payoutOptionTypeDescription={payoutOptionTypeDescription}
             bankSpecificFieldKey={bankSpecificFieldKey}
             bankSpecificFieldDescription={bankSpecificFieldDescription}
             bankNameStrategy={bankNameStrategy}
            bankBins={bankBins} banks={banks} lng={lng} />
              </Form>
            )}
          </Formik>
          <ToastContainer />
        </Container>
      )}
    </div>
  );
};


export default RecipientForm;


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

  const mySchema = Yup.object().shape({
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
  return mySchema
};




