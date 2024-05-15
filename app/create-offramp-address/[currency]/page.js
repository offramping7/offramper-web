import { fetchAvailablePayoutOptionTypesByCurrency } from "@/lib/payoutOptionTypes";
import Link from "next/link";
import Image from "next/image"

const t = (stri) => {
  return stri
}

const Page = async ({ params }) => {
  const lng = "ru";
  const { currency } = params;
  const payoutOptionTypes = await fetchAvailablePayoutOptionTypesByCurrency({
    currency,
  }); //should return full docs
  

  //here you render the 3 payout option types available as white buttons
  return (
    <>
      <div className="row">
        <div className="col-1"> </div>
        <div className="col-10">
          <h4 className="text-center mt-5 pt-5 text-muted">
          {t("Реквезиты счета на который вы хотели бы вывести деньги")}
          </h4>
          {payoutOptionTypes.map((payoutOptionType) => {
            return (
              // <div className="shadow rounded bg-white my-3 py-3">
                  <Link
                    key={payoutOptionType.payoutOptionTypeKey}
                    href={`/create-offramp-address/${currency}/${payoutOptionType.payoutOptionTypeKey}`}
                    className="shadow rounded bg-white my-3 py-3 w-100"
                  >
                    <div className="row mx-auto">
                      <div className="col-6">
                                          <Image
                          src={payoutOptionType.logoPath}
                          width={70}
                          height={70}
                          alt="Picture of the author"
                          className="float-end"
                        />
                        

                      </div>
                      <div className="col-6 my-auto">
                      <div className="text-muted">
                      {payoutOptionType.payoutOptionTypeDescriptions[lng]}
                    </div>
                    <div className="text-muted">
                      {t("на")} {payoutOptionType.bankSpecificFieldDescriptions[lng]}
                    </div>
                    </div>
                      </div>

                    {/* {JSON.stringify(payoutOptionType)} */}
                   
                  </Link>
              // </div>
            );
          })}
          <h6 className="text-center text-muted mt-3">
          {t("Пожалуйста выберите одну из опции выше")}
          </h6>
        </div>
        <div className="col-1"> </div>

      </div>
    </>
  );
};

export default Page;



//"Реквезиты счета на который вы хотели бы вывести деньги" Bank details for the account you're withdrawing money to