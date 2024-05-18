"use client";
import Image from "next/image"

const  PayoutOptionTypesMenu = ({ payoutOptionTypes, translationJson,lng,handleChangeChosenPayoutOptionTypeKey }) => {
    const t = (str) => {
        return translationJson[str] || sts
    }
  return (
    <>
      {payoutOptionTypes.map((payoutOptionType) => {
        return (
          <button
            onClick={()=> {
                handleChangeChosenPayoutOptionTypeKey(payoutOptionType.payoutOptionTypeKey)
            }}
            className={`shadow rounded bg-white my-3 py-3 w-100 gradient-bg-maker-wiener`}
          >
            <div className="row mx-auto">
              <div className="col-3">
                <Image
                  src={payoutOptionType.logoPath}
                  width={70}
                  height={70}
                  alt="Picture of the author"
                  className="float-end"
                />
              </div>
              <div className="col-9 my-auto">
                <div className="text-muted text-white">
                  {payoutOptionType.payoutOptionTypeDescriptions[lng]}
                </div>
                <div className="text-muted">
                  {t("to")}{" "}
                  {payoutOptionType.bankSpecificFieldDescriptions[lng]}
                </div>
              </div>
            </div>

            {/* {JSON.stringify(payoutOptionType)} */}
          </button>
          // </div>
        );
      })}
      <h6 className="text-center text-muted mt-3">
        {t("createOfframpAddress.bottomText")}
      </h6>
    </>
  );
};


export default PayoutOptionTypesMenu