"use client";
import React, { useEffect, useState } from "react";
import PayoutOptionTypesMenu from "./PayoutOptionTypesMenu";
import RecipientForm from "./RecipientForm";
const CreateOfframpAddressMain = ({

  payoutOptionTypes,currency,translationJson,banks,bankBins,lng,
}) => {
 
    
  const [chosenPayoutOptionTypeKey, setChosenPayoutOptionTypeKey] =
    useState("menu"); //either menu or one of payoutOptionTypeKey


  const handleChangeChosenPayoutOptionTypeKey = (val) => {
    // console.log("val is",val)
    setChosenPayoutOptionTypeKey(val);
  };

  if (chosenPayoutOptionTypeKey === "menu") {
    return (
      <PayoutOptionTypesMenu
        handleChangeChosenPayoutOptionTypeKey={handleChangeChosenPayoutOptionTypeKey}
        payoutOptionTypes={payoutOptionTypes}
        translationJson={translationJson}
        lng={lng}
      />
    );
  } else {
    return <RecipientForm 
      payoutOptionTypes={payoutOptionTypes}
      payoutOptionTypeKey={chosenPayoutOptionTypeKey}
      banks={banks}
      currency={currency}
      bankBins={bankBins} 
      translationJson={translationJson}
      lng={lng}
      />
  
    
  }
};


export default CreateOfframpAddressMain