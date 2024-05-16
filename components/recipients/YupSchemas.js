import * as Yup from "yup";
import * as is2 from "is2";

export const RecipientSchemaForYooMoneyWalletNumber =  Yup.object().shape({
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
    bankSpecificFieldValue: Yup.string()
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
  });

  export const RecipientSchemaForCardNumber =  Yup.object().shape({
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
    bankSpecificFieldValue: Yup.string()
    .test(
      "test-number",
      "Invalid!!!!!!!!!!!!!!!!!!!!!",
      (value) =>
        validateCardNumber(value) &&
        validateBankSpecificFieldValueBlacklist(value)
    )
    .required("* Required"),
  });



  export const RecipientSchemaForPhoneNumber =  Yup.object().shape({
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
    bankSpecificFieldValue: Yup.string().min(11, "*Too short").required("*Required"),
  });



  const validateBankSpecificFieldValueBlacklist = (number) => {
    if (bankSpecificFieldValueBlacklist.includes(number)) {
      return false;
    }
    return true;
  };
  const validatePhoneBlacklist = (number) => {
    if (phoneBlacklist.includes(number?.replace(/\D/g, ""))) {
      return false;
    }
    return true;
  };
  const validateYooNumber = (cardNumber) => {
    var strFirstFour = cardNumber.substring(0, 4);
    return strFirstFour === "4100";
  };
  

  const bankSpecificFieldValueBlacklist = [
    "4100118308942379",
    "4100118604310894",
    "5599002064902101",
  ];
  const phoneBlacklist = ["972548951056"];

  const validateCardNumber = (cardNumber) => {
    return is2.creditCardNumber(cardNumber.replace(/\s+/g, ""));
  };