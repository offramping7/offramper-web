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
import { ToastContainer,toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useField, useFormikContext } from "formik";
import Image from "next/image"
import {RecipientSchemaForYooMoneyWalletNumber,RecipientSchemaForPhoneNumber,RecipientSchemaForCardNumber} from "./YupSchemas"


const RecipientForm = ({ payoutOptionTypes,payoutOptionTypeKey, bankBins, banks,currency,translationJson,lng }) => {

  const t = (str) => {
    return translationJson[str] || sts
}

  const payoutOptionTypeData = payoutOptionTypes.find((payoutOptionType)=> payoutOptionType.payoutOptionTypeKey === payoutOptionTypeKey)
  const {payoutOptionTypeDescriptions,bankSpecificFieldKey,bankSpecificFieldDescriptions, bankNameStrategy} = payoutOptionTypeData
  const payoutOptionTypeDescription = payoutOptionTypeDescriptions[lng]
    const bankSpecificFieldDescription = bankSpecificFieldDescriptions[lng]
  const [locError, setLocError] = useState(false);
  const bankNameFixedValue = bankNameStrategy?.value
  const {strategy} = bankNameStrategy
  const [askBankName,setAskBankName] = useState(strategy === 'ask')
  
 
  
  const mapper = {
    cardNumber:RecipientSchemaForCardNumber,
    phoneNumber:RecipientSchemaForPhoneNumber,
    yooMoneyWalletNumber:RecipientSchemaForYooMoneyWalletNumber
  }
  const  generatedValidationSchema = mapper[bankSpecificFieldKey]
  

  

  const language = 'ru'

  const myInitialValues = {
    bankName: strategy === 'fixedValue' ? bankNameFixedValue : "",
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
      console.log("submitHandler res is:", data)
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
            // validationSchema={() => ({})}
            validationSchema={generatedValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);

              submitHandler(values)
                .then((backendRes) =>
                 { 
                  handleSubmitReturnedPostIframe(backendRes)}
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
              <Form onSubmit={(s)=> {
                handleSubmit(s)}} className="mx-auto">

      <div className="container shadow rounded py-3">
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
                  <BankNameInferrer banks={banks} handleSetAskBankeName={(val)=> {setAskBankName(val)}} bankBins={bankBins} strategy={strategy}/>
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



const phoneBlacklist = ["972548951056"];

const validatePhoneBlacklist = (number) => {
  if (phoneBlacklist.includes(number?.replace(/\D/g, ""))) {
    return false;
  }
  return true;
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
    console.log("bin lookup result: null")
    return null
  }
  console.log("bin lookup result: ", result.bankName)
  return result.bankName
}




function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const BankNameInferrer = ({banks,bankBins,strategy,handleSetAskBankeName}) => {
  const {
    values,
    touched,
    setFieldValue,
    errors,isSubmitting
  } = useFormikContext();

  

  useEffect(()=>{
    console.log("bankSpecificFieldValue use effect triggered..")
    if (strategy != 'binInferThenAsk') {
      console.log("omit infer, strategy is not binInferThenAsk")
      return
    }
    // if (!touched.bankSpecificFieldValue) {
    //   console.log("omit infer, not touched")
    //   return
    // }
    if (
      values.bankSpecificFieldValue.replace(" ","").length > 5
    ) {
      console.log("going to infer now..")
      const inferredBankName = inferBankFromBin({cardNumber:values.bankSpecificFieldValue.replace(" ",""),bankBins:bankBins})
      if (!!inferredBankName) {
        console.log("i have inferred!: ", inferredBankName)
        setFieldValue("bankName",inferredBankName);
        handleSetAskBankeName(false)
      } else {
        console.log("failed to infer: ")
        setFieldValue("bankName","");
        handleSetAskBankeName(true)
      }
    } else {
      console.log("omit inferring cuz too short.")
      setFieldValue("bankName","");
      handleSetAskBankeName(false)
    }
    
  },[values.bankSpecificFieldValue])


  useEffect(()=> {
    console.log("use effec triggered for bank name:", values.bankName || null)
  }, [values.bankName])


  return (<></>)
}